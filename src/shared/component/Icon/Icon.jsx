import PropTypes from 'prop-types';

import iconSvg from '@/assets/icon.svg';

export default function Icon({
  id,
  fill = 'black',
  stroke = 'black',
  width,
  height,
  ...props
}) {
  return (
    <svg width={width} height={height} {...props}>
      <use
        href={`${iconSvg}#${id}`}
        width={width}
        height={height}
        fill={fill}
        stroke={stroke}
      />
    </svg>
  );
}

Icon.propTypes = {
  id: PropTypes.string.isRequired,
};
