use std::collections::{HashMap, HashSet};
use oxc_ast::ast::{ArrayExpression, AssignmentExpression, BinaryExpression, CallExpression, Expression, IdentifierName, IdentifierReference, LogicalExpression, MemberExpression, NullLiteral, StringLiteral, UnaryExpression, UpdateExpression};
use oxc_ast::AstKind;
use oxc_ast_visit::{walk, Visit};
use oxc_codegen::Codegen;
use oxc_syntax::scope::ScopeFlags;
use crate::parser::ScopingAndNodes;

pub struct OpcodesMapperVisitor<'a> {
    pub scoping: &'a ScopingAndNodes<'a>,
    pub opcodes_signatures: HashMap<usize, String>
}

impl<'a> Visit<'a> for OpcodesMapperVisitor<'a> {
    fn visit_array_expression(&mut self, it: &ArrayExpression<'a>) {
        if it.elements.len() < 20 {
            return;
        }
        
        // let mut signatures = HashMap::new();
        
        for (idx, element) in it.elements.iter().enumerate() {
            if !element.is_expression() {
                return;
            }
            
            let expr = element.as_expression().unwrap();
            if let Expression::FunctionExpression(func) = expr {
                let mut mapper = FunctionMapper::default();
                walk::walk_function(&mut mapper, func, ScopeFlags::empty());
                
                if mapper.signature == "push" {
                    let mut args_mapper = FunctionArgumentsMapper{
                        scoping: self.scoping,
                        signature: String::new(),
                    };
                    
                    walk::walk_function(&mut args_mapper, func, ScopeFlags::empty());
                    mapper.signature.push_str(&args_mapper.signature);
                }
                
                self.opcodes_signatures.insert(idx, format!("{:#x}", md5::compute(mapper.signature.clone())));
            } else {
                return;
            }
        }
        
        let mut met_signatures = HashSet::new();
        for (idx, signature) in &self.opcodes_signatures {
            if met_signatures.contains(signature) {
                let mut codegen = Codegen::new();
                codegen.print_expression(it.elements[*idx].as_expression().unwrap());
                println!("dupe signature for {}: {} {}", idx, signature, codegen.into_source_text());
            }
            
            met_signatures.insert(signature);
        }
        println!("Dupes: {}", self.opcodes_signatures.len() - met_signatures.len());
    }
}

#[derive(Default)]
struct FunctionMapper {
    signature: String
}

impl<'a> Visit<'a> for FunctionMapper {
    fn visit_identifier_name(&mut self, it: &IdentifierName<'a>) {
        if it.name == "pop" || it.name == "push" || it.name == "apply" || it.name == "splice" {
            self.signature.push_str(it.name.as_str());
        }

        walk::walk_identifier_name(self, it);
    }

    fn visit_identifier_reference(&mut self, it: &IdentifierReference<'a>) {
        if it.name == "Function" || it.name == "atob" || it.name == "decodeURIComponent" || it.name == "undefined" || it.name == "window" || it.name == "String" || it.name == "arguments" || it.name == "Array" {
            self.signature.push_str(it.name.as_str());
        }

        walk::walk_identifier_reference(self, it);
    }
    
    fn visit_update_expression(&mut self, it: &UpdateExpression<'a>) {
        self.signature.push_str(it.operator.as_str());
        walk::walk_update_expression(self, it);
    }

    fn visit_unary_expression(&mut self, it: &UnaryExpression<'a>) {
        self.signature.push_str(it.operator.as_str());
        walk::walk_unary_expression(self, it);
    }

    fn visit_binary_expression(&mut self, it: &BinaryExpression<'a>) {
        self.signature.push_str(it.operator.as_str());
        walk::walk_binary_expression(self, it);
    }

    fn visit_logical_expression(&mut self, it: &LogicalExpression<'a>) {
        self.signature.push_str(it.operator.as_str());
        walk::walk_logical_expression(self, it);
    }

    fn visit_assignment_expression(&mut self, it: &AssignmentExpression<'a>) {
        self.signature.push_str(it.operator.as_str());
        walk::walk_assignment_expression(self, it);
    }

    fn visit_null_literal(&mut self, it: &NullLiteral) {
        self.signature.push_str("null");
        walk::walk_null_literal(self, it);
    }
}

struct FunctionArgumentsMapper<'a> {
    scoping: &'a ScopingAndNodes<'a>,
    signature: String
}

impl<'a> Visit<'a> for FunctionArgumentsMapper<'a> {
    fn visit_call_expression(&mut self, it: &CallExpression<'a>) {
        if it.arguments.len() != 1 {
            return;
        }
        
        if let Expression::Identifier(identifier) = it.arguments[0].as_expression().unwrap() {
            let reference = self.scoping.scoping.get_reference(identifier.reference_id());
            let symbol_id = reference.symbol_id().unwrap();
            let scope_id = self.scoping.scoping.symbol_scope_id(symbol_id);
            let binding = self.scoping.scoping.get_binding(scope_id, identifier.name.as_str()).unwrap();
            let symbol_decl = self.scoping.scoping.symbol_declaration(binding);
            
            let kind = self.scoping.nodes.get_node(symbol_decl).kind();
            
            match kind {
                AstKind::VariableDeclarator(declarator) => {
                    self.signature.push_str("var_ref");

                    let mut strings_mapper = SimpleStringMapper::default();
                    walk::walk_variable_declarator(&mut strings_mapper, declarator);

                    strings_mapper.strings.sort();
                    self.signature.push_str(strings_mapper.strings.join(";").as_str());
                }
                AstKind::Function(func) => {
                    self.signature.push_str("function_ref");

                    let mut strings_mapper = SimpleStringMapper::default();
                    walk::walk_function(&mut strings_mapper, func, ScopeFlags::empty());

                    strings_mapper.strings.sort();
                    self.signature.push_str(strings_mapper.strings.join(";").as_str());
                }
                _ => {}
            }
        }
    }
}

#[derive(Default)]
struct SimpleStringMapper {
    strings: Vec<String>
}

impl<'a> Visit<'a> for SimpleStringMapper {
    fn visit_string_literal(&mut self, it: &StringLiteral<'a>) {
        if it.value == "move" || it.value == "mouse" || it.value == "touchstart" || it.value == "safari" || it.value == "div" || it.value == "#" {
            self.strings.push(it.value.to_string());
        }
        walk::walk_string_literal(self, it);
    }
}