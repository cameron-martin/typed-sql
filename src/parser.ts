import { ParseFail, ParseStringCaseInsensitive, ParseSuccess } from "./parser-library";
import { SelectStatement } from "./ast";

export type Parse<S extends string> =
    ParseSelectStatement<S> extends ParseSuccess<infer X, ''> ? ParseSuccess<X, ''> :
    ParseFail;

type ParseSelectStatement<S extends string> =
    ParseStringCaseInsensitive<'SELECT ', S> extends ParseSuccess<any, infer R0> ? (
        ParseFields<R0> extends ParseSuccess<infer Fields, infer R1> ? (
            ParseStringCaseInsensitive<' FROM ', R1> extends ParseSuccess<any, infer R2> ? (
                ParseFromItem<R2> extends ParseSuccess<infer From, infer R3> ? (
                    ParseWhere<R3> extends ParseSuccess<infer Where, infer R4> ? (
                        ParseSuccess<SelectStatement<Fields, From, [], Where>, R4>
                    ) : ParseFail
                ) : ParseFail
            ) : ParseFail
        ) : ParseFail
    ) : ParseFail;

type ParseFields<S extends string> = any;
type ParseFromItem<S extends string> = any;
type ParseWhere<S extends string> = any;