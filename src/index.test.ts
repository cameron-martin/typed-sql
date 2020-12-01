import { SqlClient } from './index';
import { expectType, TypeOf, TypeEqual } from "ts-expect";

interface TestSchema {
    users: {
        foo: number,
        bar: string,
        baz: boolean,
    }
}

test('simple select statement', () => {
    let result = new SqlClient<TestSchema>().query('SELECT foo, bar FROM users');

    expectType<TypeEqual<{ foo: number, bar: string }[], typeof result>>(true);
});

test('select statement with where clause', () => {
    let result = new SqlClient<TestSchema>().query('SELECT foo, bar, baz FROM users WHERE bar = "hello"');

    expectType<TypeEqual<{ foo: number, bar: string, baz: boolean }[], typeof result>>(true);
});

test('select statement with aliasing fields statement with where clause', () => {
    let result = new SqlClient<TestSchema>().query('SELECT foo AS foo2, bar, baz FROM users WHERE bar = "hello"');

    expectType<TypeEqual<{ foo2: number, bar: string, baz: boolean }[], typeof result>>(true);
});
