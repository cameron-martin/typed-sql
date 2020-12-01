export type ParseSuccess<T, X extends T, R extends string> = { success: true, result: X, rest: R };
export type ParseFail = { success: false };

export type ParseLiteral<Literal extends string, S extends string> = S extends `${Literal}${infer R}` ? ParseSuccess<string, Literal, R> : ParseFail;

/**
 * Consumes a single character of whitespace.
 * TODO: Add more whitespace chars
 */
export type ParseSingleWhitespace<S extends string> =
  S extends ` ${infer R}` ? ParseSuccess<string, ' ', R> :
  S extends `\t${infer R}` ? ParseSuccess<string, '\t', R> :
  ParseFail;

/**
 * Consumes 0 or more characters of whitespace as possible, returning the consumed whitespace.
 */
export type ParseManyWhitespace<S extends string> =
  ParseSingleWhitespace<S> extends ParseSuccess<string, infer T1, infer R0> ?
  (ParseManyWhitespace<R0> extends ParseSuccess<string, infer T2, infer R1> ? ParseSuccess<string, `${T1}${T2}`, R1> : ParseSuccess<string, T1, R0> ) : ParseSuccess<string, '', S>;

/**
 * Consumes 1 or more characters of whitespace as possible, returning the consumed whitespace.
 */
export type ParseMany1Whitespace<S extends string> =
  ParseSingleWhitespace<S> extends ParseSuccess<string, infer T1, infer R0> ?
  (ParseManyWhitespace<R0> extends ParseSuccess<string, infer T2, infer R1> ? ParseSuccess<string, `${T1}${T2}`, R1> : ParseSuccess<string, T1, R0> ) : ParseFail;