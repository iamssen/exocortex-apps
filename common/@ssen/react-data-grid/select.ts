export type PropertyKeys<Row, PropertyType> = {
  [K in keyof Row]: Row[K] extends PropertyType | undefined | null ? K : never;
}[keyof Row];

export type ValueSelector<Row, ValueType> =
  | PropertyKeys<Row, ValueType>
  | ((row: Row) => ValueType | undefined);

export function selectValue<Row, ValueType>(
  row: Row,
  selector: ValueSelector<Row, ValueType>,
): ValueType | undefined {
  return typeof selector === 'function'
    ? selector(row)
    : (row[selector] as ValueType | undefined);
}
