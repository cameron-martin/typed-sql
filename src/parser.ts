import { ParseFail, ParseString, ParseStringCaseInsensitive, ParseStringLiteral, ParseSuccess } from "./parser-library";
import { Expression, FieldSpecifier, Identifier, SelectStatement, StringConstant, TableSpecifier, BooleanConstant, ColumnReference } from "./ast";

export type Parse<S extends string> =
    ParseSelectStatement<S> extends ParseSuccess<infer X, ''> ? ParseSuccess<X, ''> :
    ParseFail;

type ParseSelectStatement<S extends string> =
    ParseStringCaseInsensitive<'SELECT ', S> extends ParseSuccess<any, infer R0> ? (
        ParseFields<R0> extends ParseSuccess<infer Fields, infer R1, FieldSpecifier<any, any>[]> ? (
            ParseStringCaseInsensitive<' FROM ', R1> extends ParseSuccess<any, infer R2> ? (
                ParseFromItem<R2> extends ParseSuccess<infer From, infer R3, TableSpecifier<any, any>> ? (
                    ParseWhere<R3> extends ParseSuccess<infer Where, infer R4, Expression> ? (
                        ParseSuccess<SelectStatement<Fields, From, [], Where>, R4>
                    ) : ParseFail
                ) : ParseFail
            ) : ParseFail
        ) : ParseFail
    ) : ParseFail;

export type ParseFields<S extends string> =
    ParseField<S> extends ParseSuccess<infer Field, infer R0> ? (
        ParseFieldSeparator<R0> extends ParseSuccess<any, infer R1> ? (
            ParseFields<R1> extends ParseSuccess<infer Fields, infer R2, any[]> ? (
                ParseSuccess<[Field, ...Fields], R2>
            ) : ParseFail
        ) : ParseSuccess<[Field], R0>
    ) : ParseSuccess<[], S>;

// TODO: Make this actually correct
type ParseField<S extends string> =
    S extends `${infer H}, ${infer R}` ? ParseSuccess<FieldSpecifier<ColumnReference<null, H>>, `, ${R}`> :
    S extends `${infer H} ${infer R}` ? ParseSuccess<FieldSpecifier<ColumnReference<null, H>>, ` ${R}`> :
    ParseSuccess<FieldSpecifier<ColumnReference<null, S>>, ''>;

// TODO: Make this more robust
type ParseFieldSeparator<S extends string> = ParseString<', ', S>;

type ParseFromItem<S extends string> =
    S extends `${infer H} ${infer R}` ? ParseSuccess<TableSpecifier<Identifier<H>, Identifier<H>>, ` ${R}`> :
    ParseSuccess<TableSpecifier<Identifier<S>, Identifier<S>>, ''>;

type ParseWhere<S extends string> =
    ParseStringCaseInsensitive<' WHERE ', S> extends ParseSuccess<any, infer R0> ? (
        ParseExpression<R0>
    ) : ParseSuccess<BooleanConstant<true>, S>;

type ParseExpression<S extends string> =
    ParseConstant<S> extends ParseSuccess<infer X, infer R>  ? ParseSuccess<X, R> :
    ParseFail;

type ParseParenthesisedExpression<S extends string> =
    ParseString<"(", S> extends ParseSuccess<any, infer R> ? (
        ParseExpression<R> extends ParseSuccess<infer X, infer R, Expression> ? (
            ParseString<")", S> extends ParseSuccess<any, infer R> ? (
                ParseSuccess<X, R>
            ) : ParseFail
        ) : ParseFail
    ) : ParseFail;

type ParseConstant<S extends string> =
    ParseStringLiteral<"'", "'", S> extends ParseSuccess<infer X, infer R, string> ? ParseSuccess<StringConstant<X>, R> :
    ParseStringCaseInsensitive<"true", S> extends ParseSuccess<any, infer R> ? ParseSuccess<BooleanConstant<true>, R> :
    ParseStringCaseInsensitive<"false", S> extends ParseSuccess<any, infer R> ? ParseSuccess<BooleanConstant<false>, R> :
    ParseFail;

type ParseFieldSelection<S extends string> =
    ParseParenthesisedExpression<S> extends ParseSuccess<infer X, infer R> ? (
        ParseIdentifier extends 
    ) :
    ParseIdentifier<S> extends ParseSuccess<infer X, infer R> ? (

    ) :
    ParseFail;
