import { ParseFail, ParseString, ParseStringCaseInsensitive, ParseSuccess } from "./parser-library";
import { Expression, FieldSpecifier, Identifier, SelectStatement, TableSpecifier } from "./ast";
import { BooleanLiteral } from "@codemix/ts-sql";

export type Parse<S extends string> =
    ParseSelectStatement<S> extends ParseSuccess<infer X, ''> ? ParseSuccess<X, ''> :
    ParseFail;

type ParseSelectStatement<S extends string> =
    ParseStringCaseInsensitive<'SELECT ', S> extends ParseSuccess<any, infer R0> ? (
        ParseFields<R0> extends ParseSuccess<infer Fields, infer R1, FieldSpecifier<any, Identifier<string>>[]> ? (
            ParseStringCaseInsensitive<' FROM ', R1> extends ParseSuccess<any, infer R2> ? (
                ParseFromItem<R2> extends ParseSuccess<infer From, infer R3, TableSpecifier<any, any>> ? (
                    ParseWhere<R3> extends ParseSuccess<infer Where, infer R4, Expression> ? (
                        ParseSuccess<SelectStatement<Fields, From, [], Where>, R4>
                    ) : ParseFail
                ) : ParseFail
            ) : ParseFail
        ) : ParseFail
    ) : ParseFail;

// type ParseNonEmptyFields<S extends string> = 

type ParseFields<S extends string> =
    ParseField<S> extends ParseSuccess<infer Field, infer R0> ? (
        ParseFieldSeparator<R0> extends ParseSuccess<any, infer R1> ? (
            ParseFields<R1> extends ParseSuccess<infer Fields, infer R2, any[]> ? (
                ParseSuccess<[Field, ...Fields], R2>
            ) : ParseFail
        ) : ParseSuccess<[Field], R0>
    ) : ParseSuccess<[], S>;

type ParseField<S extends string> = ParseFail;
// TODO: Make this more robust
type ParseFieldSeparator<S extends string> = ParseString<', ', S>;
type ParseFromItem<S extends string> = ParseFail;
type ParseWhere<S extends string> =
    ParseStringCaseInsensitive<' WHERE ', S> extends ParseSuccess<any, infer R0> ? (
        ParseExpression<R0>
    ) : ParseSuccess<BooleanLiteral<true>, S>;

type ParseExpression<S extends string> = ParseFail;