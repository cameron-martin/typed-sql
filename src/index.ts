import { FieldSpecifier, Identifier, Parse as ParseSql, SelectStatement, Statement, TableSpecifier } from "@codemix/ts-sql";

type Evaluate<Schema, Ast extends Statement> = Ast extends SelectStatement<infer Fields, infer From, infer Joins, infer Where, infer Offset, infer Limit>
    ? EvaluateFields<Schema, From, Fields>
    : unknown;

type EvaluateFields<Schema, From extends TableSpecifier<any, any>, Fields extends FieldSpecifier<any>[]> =
    Fields extends [infer Head, ...infer Tail] ? (Head extends FieldSpecifier<any> ? EvaluateField<Schema, From, Head> : {}) & ( Tail extends FieldSpecifier<any>[] ? EvaluateFields<Schema, From, Tail> : {}) : {};

type EvaluateField<Schema, From extends TableSpecifier<any, any>, Field extends FieldSpecifier<any>> =
    Field extends FieldSpecifier<Identifier<infer SourceName>, Identifier<infer AliasName>> ? { [K in AliasName]: PickFieldType<Schema, From, SourceName> } : {} 

type PickFieldType<Schema, From extends TableSpecifier<any, any>, FieldName extends string> =
    From extends TableSpecifier<Identifier<infer SourceName>> ? (SourceName extends keyof Schema ? FieldName extends keyof Schema[SourceName] ? Schema[SourceName][FieldName] : unknown : unknown) : unknown;

export class SqlClient<Schema> {
    query<Query extends string>(query: Query): Evaluate<Schema, ParseSql<Query>>[] {
        return undefined as any;
    }
}
