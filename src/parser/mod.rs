mod mapper;

use std::collections::HashMap;
use oxc_allocator::Allocator;
use oxc_ast::ast::{ArrayExpression, CallExpression, Expression, FunctionBody};
use oxc_ast_visit::Visit;
use oxc_ast_visit::walk;
use oxc_parser::Parser;
use oxc_semantic::{AstNodes, Scoping, SemanticBuilder};
use oxc_span::SourceType;
use crate::parser::mapper::OpcodesMapperVisitor;

pub struct ParsedScript {
    pub bytecode: Vec<i32>,
    pub pool: String,
    pub opcodes_signatures: HashMap<usize, String>
}

struct ScriptVisitor<'a> {
    scoping: ScopingAndNodes<'a>,
    bytecode: Option<Vec<i32>>,
    pool: Option<String>,
    opcodes_signatures: Option<HashMap<usize, String>>,
}

impl<'a> Visit<'a> for ScriptVisitor<'a> {
    fn visit_function_body(&mut self, it: &FunctionBody<'a>) {
        let mut pool_visitor = VMPoolVisitor::default();
        walk::walk_function_body(&mut pool_visitor, it);
        
        if pool_visitor.string_pool.is_some() && pool_visitor.bytecode.is_some() {
            let mut opcodes_mapper = OpcodesMapperVisitor {
                scoping: &self.scoping,
                opcodes_signatures: HashMap::new(),
            };
            
            walk::walk_function_body(&mut opcodes_mapper, it);
            self.opcodes_signatures = Some(opcodes_mapper.opcodes_signatures);
            self.bytecode = Some(pool_visitor.bytecode.unwrap());
            self.pool = Some(pool_visitor.string_pool.unwrap());
        }
        
        walk::walk_function_body(self, it);
    }
}

#[derive(Default)]
struct VMPoolVisitor {
    bytecode: Option<Vec<i32>>,
    string_pool: Option<String>
}
impl<'a> Visit<'a> for VMPoolVisitor {
    fn visit_array_expression(&mut self, it: &ArrayExpression<'a>) {
        if it.elements.len() < 100 {
            return;
        }
        
        let mut bytecode = Vec::new();
        for element in &it.elements {
            if !element.is_expression() {
                return;
            }
            
            if let Expression::NumericLiteral(num) = element.as_expression().unwrap() {
                bytecode.push(num.value as i32);
            }
        }
        
        self.bytecode = Some(bytecode);
    }
    
    fn visit_call_expression(&mut self, it: &CallExpression<'a>) {
        if let Expression::Identifier(identifier) = &it.callee {
            if identifier.name == "atob" && it.arguments.len() == 1 && it.arguments[0].is_expression() {
                if let Expression::StringLiteral(literal) = it.arguments[0].as_expression().unwrap() {
                    if literal.value.len() > 100 {
                        self.string_pool = Some(literal.value.to_string());
                    }
                }
            }
        }
        
        walk::walk_call_expression(self, it);
    }

    // We don't want to traverse function bodies inside function bodies
    fn visit_function_body(&mut self, it: &FunctionBody<'a>) {}
}

pub struct ScopingAndNodes<'a> {
    scoping: Scoping,
    nodes: AstNodes<'a>
}

pub fn parse_script(script: &str) -> ParsedScript {
    let source_type = SourceType::default().with_module(false);
    let allocator = Allocator::default();
    let parsed = Parser::new(&allocator, script, source_type).parse();
    let program = allocator.alloc(parsed.program);

    let (scoping, nodes) = SemanticBuilder::new().build(&program).semantic.into_scoping_and_nodes();
    
    let mut visitor = ScriptVisitor {
        scoping: ScopingAndNodes { scoping, nodes },
        bytecode: None,
        pool: None,
        opcodes_signatures: None,
    };
    
    walk::walk_program(&mut visitor, program);
    ParsedScript {
        bytecode: visitor.bytecode.unwrap(),
        pool: visitor.pool.unwrap(),
        opcodes_signatures: visitor.opcodes_signatures.unwrap()
    }
}