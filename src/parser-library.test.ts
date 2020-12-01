import { ParseSuccess, ParseFail, ParseChar, ParseMany, ParseMany1, ParseStringLiteral, ParseStringCaseInsensitive, Whitespace } from './parser-library';
import { expectType, TypeOf, TypeEqual } from "ts-expect";

describe('ParseChar', () => {
    it('parses a single char from the front', () => {
        type Result = ParseChar<Whitespace, "   ">;
        type Expected = ParseSuccess<" ", "  ">;
    
        expectType<TypeEqual<Result, Expected>>(true);
    });

    it('fails when string contains none of the characters at front', () => {
        type Result = ParseChar<Whitespace, "foo">;
        type Expected = ParseFail;
    
        expectType<TypeEqual<Result, Expected>>(true);
    });
});

describe('ParseMany', () => {
    it('parses empty string and consumes nothing if no whitespace at front', () => {
        type Result = ParseMany<Whitespace, "foo ">;
        type Expected = ParseSuccess<"", "foo ">;
    
        expectType<TypeEqual<Result, Expected>>(true);
    });

    // it('parses and consumes all whitespace characters from start of string', () => {
    //     type Result = ParseMany<Whitespace, " foo bar">;
    //     type Expected = ParseSuccess<" ", "foo bar">;
    
    //     expectType<TypeEqual<Result, Expected>>(true);
    // });
});

describe('ParseStringLiteral', () => {
    describe('single quotes', () => {
        it('parses empty string with no remainder', () => {
            type Result = ParseStringLiteral<"''">;
            type Expected = ParseSuccess<"", "">;
        
            expectType<TypeEqual<Result, Expected>>(true);
        });

        it('parses empty string with remainder', () => {
            type Result = ParseStringLiteral<"'' foo">;
            type Expected = ParseSuccess<"", " foo">;
        
            expectType<TypeEqual<Result, Expected>>(true);
        });

        it('parses simple string', () => {
            type Result = ParseStringLiteral<"'foo' bar">;
            type Expected = ParseSuccess<"foo", " bar">;
        
            expectType<TypeEqual<Result, Expected>>(true);
        });

        it('parses string with escaped quote', () => {
            type Result = ParseStringLiteral<"'foo\\'' bar">;
            type Expected = ParseSuccess<"foo'", " bar">;
        
            expectType<TypeEqual<Result, Expected>>(true);
        });

        it('parses string with escaped non-quote value', () => {
            type Result = ParseStringLiteral<"'fo\\o' bar">;
            type Expected = ParseSuccess<"foo", " bar">;
        
            expectType<TypeEqual<Result, Expected>>(true);
        });
    });

    describe('double quotes', () => {
        it('parses empty string with no remainder', () => {
            type Result = ParseStringLiteral<'""'>;
            type Expected = ParseSuccess<"", "">;
        
            expectType<TypeEqual<Result, Expected>>(true);
        });

        it('parses empty string with remainder', () => {
            type Result = ParseStringLiteral<'"" foo'>;
            type Expected = ParseSuccess<"", " foo">;
        
            expectType<TypeEqual<Result, Expected>>(true);
        });

        it('parses simple string', () => {
            type Result = ParseStringLiteral<'"foo" bar'>;
            type Expected = ParseSuccess<"foo", " bar">;
        
            expectType<TypeEqual<Result, Expected>>(true);
        });

        it('parses string with escaped quote', () => {
            type Result = ParseStringLiteral<'"foo\\"" bar'>;
            type Expected = ParseSuccess<"foo\"", " bar">;
        
            expectType<TypeEqual<Result, Expected>>(true);
        });

        it('parses string with escaped non-quote value', () => {
            type Result = ParseStringLiteral<'"fo\\o" bar'>;
            type Expected = ParseSuccess<"foo", " bar">;
        
            expectType<TypeEqual<Result, Expected>>(true);
        });
    });

    it('does not parse mixed quotes', () => {
        type Result = ParseStringLiteral<'"foo\' bar'>;
        type Expected = ParseFail;
    
        expectType<TypeEqual<Result, Expected>>(true);
    });
});

describe('ParseStringCaseInsensitive', () => {
    it('parses case insensitively', () => {
        type Result = ParseStringCaseInsensitive<'SelecT', 'sElEcT * FROM users'>;
        type Expected = ParseSuccess<"sElEcT", " * FROM users">;
    
        expectType<TypeEqual<Result, Expected>>(true);
    });

    it('parses empty string', () => {
        type Result = ParseStringCaseInsensitive<'', 'SELECT * FROM users'>;
        type Expected = ParseSuccess<'', "SELECT * FROM users">;
    
        expectType<TypeEqual<Result, Expected>>(true);
    });

    it('fails if string is not a prefix', () => {
        type Result = ParseStringCaseInsensitive<'UPDATE', 'SELECT * FROM users'>;
        type Expected = ParseFail;
    
        expectType<TypeEqual<Result, Expected>>(true);
    });
});