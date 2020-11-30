type ParseQuery<Schema, Query extends string> =
    Query extends `SELECT ${infer Params} FROM ${infer Table}`
    ? Table extends keyof Schema
        ? { [K in ParseParams<Params>[number]]: (K extends keyof Schema[Table] ? Schema[Table][K] : never) }
        : unknown
    : unknown;

type ParseParams<Params extends string> = Params extends `${infer Tail}, ${infer Rest}` ? [Tail, ...ParseParams<Rest>] : [Params];

export class SqlClient<Schema> {
    query<Query extends string>(query: Query): ParseQuery<Schema, Query>[] {
        return undefined as any;
    }
}
