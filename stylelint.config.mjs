import propertyGroups from 'stylelint-config-recess-order/groups';

const stylelintConfig = {
  plugins: ['stylelint-order'],
  rules: {
    'order/properties-order': [
      propertyGroups.map((group) => ({
        ...group,
        emptyLineBefore: 'threshold',
        noEmptyLineBetween: true,
      })),
      {
        emptyLineMinimumPropertyThreshold: 8,
      },
    ],
  },
};

export default stylelintConfig;
