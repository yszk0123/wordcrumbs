import React, { useCallback, useState } from 'react';
import { routingPaths } from '../routingPaths';

interface Props {}

export const Search: React.FunctionComponent<Props> = () => {
  const [value, setValue] = useState();

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.currentTarget.value;
      setValue(value);
    },
    [],
  );

  return (
    <form action={routingPaths.words}>
      <input type="text" name="url" value={value} onChange={handleChange} />
      <button type="submit">Search</button>
    </form>
  );
};
