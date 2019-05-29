import React from 'react';
import { observer } from 'mobx-react-lite';

const SpacesCarousel = observer(({ spaces, spacesLength }) => {
  return (
    spacesLength > 1 && (
      <div className="column flex justify-center w-100">
        {spaces.map((space, index) => (
          <div key={space.id}>{index}</div>
        ))}
        <div>Add new space</div>
      </div>
    )
  );
});

export default SpacesCarousel;
