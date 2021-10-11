/**
 * Represents a successful parse, yielding the value `X` with remaining input `R`.
 */
export type ParseSuccess<X extends T, R extends string, T = unknown> = { success: true, result: X, rest: R };

/**
 * Represents a failed parse.
 */
export type ParseFail = { success: false };

/**
 * Consumes a literal string, yielding that value.
 */
export type ParseString<Literal extends string, S extends string> = S extends `${Literal}${infer R}` ? ParseSuccess<Literal, R> : ParseFail;

/**
 * Like ParseLiteral, but matches case-insensitively. Yields the consumed string.
 */
export type ParseStringCaseInsensitive<Literal extends string, S extends string> =
  Literal extends `${infer L0}${infer L1}` ? (
    S extends `${infer S0}${infer S1}` ? (
      Lowercase<S0> extends Lowercase<L0> ? (
        ParseStringCaseInsensitive<L1, S1> extends ParseSuccess<infer X1, infer R, string> ?  ParseSuccess<`${S0}${X1}`, R> : ParseFail
      ) : ParseFail
    ) : ParseFail
  ) : ParseSuccess<'', S>;

/**
 * A union of all whitespace characters. Can be combined with `ParseChar` to parse these characters.
 */
export type Whitespace = ' ' | '\t';

/**
 * Consumes a single character, given a union of chars.
 */
export type ParseChar<Chars extends string, S extends string> =
  S extends `${infer Char}${infer R}` ?
  (Char extends Chars ? ParseSuccess<Char, R> : ParseFail) :
  ParseFail;

/**
 * Consumes a single character of whitespace, yielding that character.
 * TODO: Add more whitespace chars
 */
export type ParseWhitespaceChar<S extends string> = ParseChar<' ' | '\t', S>;

/**
 * Greedily consumes 0 or more characters from `Chars`, yielding the consumed whitespace.
 */
export type ParseMany<Chars extends string, S extends string> =
  ParseChar<Chars, S> extends ParseSuccess<infer X1, infer R0, string> ? (
    ParseMany<Chars, R0> extends ParseSuccess<infer X2, infer R1, string> ? ParseSuccess<`${X1}${X2}`, R1> : ParseSuccess<X1, R0>
  ) : ParseSuccess<'', S>;

/**
 * Greedily consumes 1 or more characters from `Chars`, yielding the consumed whitespace.
 */
export type ParseMany1<Chars extends string, S extends string> = FailIfYields<ParseMany<Chars, S>, ''>;

/**
 * Fails the parser if `ParseResult` yields `X`
 */
type FailIfYields<ParseResult, X> = ParseResult extends ParseSuccess<X, any> ? ParseFail : ParseResult;

/**
 * Parse a string literal in single or double quotes, with backslash-escaping
 */
export type ParseStringLiteral<Quote extends string, Escape extends string, S extends string> =
  S extends `${Quote}${infer R0}`
  ? ParseInsideStringLiteral<Quote, Escape, R0>
  : ParseFail;

type ParseInsideStringLiteral<Quote extends string, Escape extends string, S extends string> =
  S extends `${Quote}${infer R0}` ? ParseSuccess<'', R0> :
  S extends `${Escape}${infer X0}${infer R0}` ? (ParseInsideStringLiteral<Quote, Escape, R0> extends ParseSuccess<infer X1, infer R1, string> ? ParseSuccess<`${X0}${X1}`, R1> : ParseFail) :
  S extends `${infer X0}${infer R0}` ? (ParseInsideStringLiteral<Quote, Escape, R0> extends ParseSuccess<infer X1, infer R1, string> ? ParseSuccess<`${X0}${X1}`, R1> : ParseFail) :
  ParseFail;
