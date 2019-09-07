import React from 'react';
import { Word, WordType } from '../WordAPI';

const styles: Record<WordType, React.CSSProperties> = {
  [WordType.DEFAULT]: { opacity: 0.5 },
  [WordType.HIGHLIGHT]: {},
};

interface Props {
  words: Word[];
}

export const WordList: React.FunctionComponent<Props> = ({ words }) => {
  return (
    <div>
      {words.map((word, index) => {
        return (
          <span key={index} style={styles[word.type]}>
            {word.value}
          </span>
        );
      })}
    </div>
  );
};
