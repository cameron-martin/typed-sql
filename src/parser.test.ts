import { Parse } from './parser';
import { expectType, TypeOf, TypeEqual } from "ts-expect";
import { FieldSpecifier, SelectStatement, Identifier, TableSpecifier, BooleanLiteral, BinaryExpression, StringLiteral } from './ast';

test('simple select statement', () => {
    type Result = Parse<"SELECT id, name FROM users">;
    type Expected = SelectStatement<
        [
            FieldSpecifier<Identifier<"id">, Identifier<"id">>,
            FieldSpecifier<Identifier<"name">, Identifier<"name">>,
        ],
        TableSpecifier<Identifier<"users">, Identifier<"users">>,
        [],
        BooleanLiteral<true>,
        number, // TODO: Fix this (should be 0)
        number | null // TODO: Fix this (should be null)
    >;

    expectType<TypeEqual<Result, Expected>>(true);
});

test('select statement with where clause', () => {
    type Result = Parse<'SELECT id, name FROM users WHERE name = "hello"'>;
    type Test1 = Result['where']
    type Test2 = Expected['where']
    type Expected = SelectStatement<
        [
            FieldSpecifier<Identifier<"id">, Identifier<"id">>,
            FieldSpecifier<Identifier<"name">, Identifier<"name">>,
        ],
        TableSpecifier<Identifier<"users">, Identifier<"users">>,
        [],
        BinaryExpression<Identifier<"name">, "=", StringLiteral<"hello">>,
        0,
        null
    >;

    expectType<TypeEqual<Result, Expected>>(true);
});

// test('select statement with aliasing fields statement with where clause', () => {
//     let result = new SqlClient<TestSchema>().query('SELECT foo AS foo2, bar, baz FROM users WHERE bar = "hello"');

//     expectType<TypeEqual<{ foo2: number, bar: string, baz: boolean }[], typeof result>>(true);
// });
