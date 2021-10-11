import { Parse, ParseFields } from './parser';
import { expectType, TypeEqual } from "ts-expect";
import { FieldSpecifier, SelectStatement, Identifier, TableSpecifier, BooleanConstant, BinaryExpression, StringConstant, ColumnReference } from './ast';
import { ParseFail, ParseSuccess } from './parser-library';

test('ParseFields', () => {
    type Result = ParseFields<"id, name FROM users">;
    type Expected = ParseSuccess<[
        FieldSpecifier<ColumnReference<null, "id">>,
        FieldSpecifier<ColumnReference<null, "name">>,
    ], ' FROM users'>;

    expectType<TypeEqual<Result, Expected>>(true);
});

test('simple select statement', () => {
    type Result = Parse<"SELECT id, name FROM users">;
    type Expected = ParseSuccess<SelectStatement<
        [
            FieldSpecifier<ColumnReference<null, "id">>,
            FieldSpecifier<ColumnReference<null, "name">>,
        ],
        TableSpecifier<Identifier<"users">, Identifier<"users">>,
        [],
        BooleanConstant<true>,
        0,
        null
    >, ''>;

    expectType<TypeEqual<Result, Expected>>(true);
});


test('select statement with column reference field selection', () => {
    type Result = Parse<"SELECT users.id, users.name FROM users">;
    type Expected = ParseSuccess<SelectStatement<
        [
            FieldSpecifier<ColumnReference<Identifier<"users">, "id">>,
            FieldSpecifier<ColumnReference<Identifier<"users">, "name">>,
        ],
        TableSpecifier<Identifier<"users">, Identifier<"users">>,
        [],
        BooleanConstant<true>,
        0,
        null
    >, ''>;

    expectType<TypeEqual<Result, Expected>>(true);
});

test('select statement with where clause', () => {
    type Result = Parse<'SELECT id, name FROM users WHERE name = "hello"'>;
    type Expected = SelectStatement<
        [
            FieldSpecifier<ColumnReference<null, "id">>,
            FieldSpecifier<ColumnReference<null, "name">>,
        ],
        TableSpecifier<Identifier<"users">, Identifier<"users">>,
        [],
        BinaryExpression<Identifier<"name">, "=", StringConstant<"hello">>,
        0,
        null
    >;

    expectType<TypeEqual<Result, Expected>>(true);
});

test('select statement with constant where clause', () => {
    type Result = Parse<'SELECT id, name FROM users WHERE true'>;
    type Expected = ParseSuccess<SelectStatement<
        [
            FieldSpecifier<ColumnReference<null, "id">>,
            FieldSpecifier<ColumnReference<null, "name">>,
        ],
        TableSpecifier<Identifier<"users">, Identifier<"users">>,
        [],
        BooleanConstant<true>,
        0,
        null
    >, ''>;

    expectType<TypeEqual<Result, Expected>>(true);
});

// test('select statement with aliasing fields statement with where clause', () => {
//     let result = new SqlClient<TestSchema>().query('SELECT foo AS foo2, bar, baz FROM users WHERE bar = "hello"');

//     expectType<TypeEqual<{ foo2: number, bar: string, baz: boolean }[], typeof result>>(true);
// });
