import propertyGroups from 'stylelint-config-recess-order/groups';

const stylelintConfig = {
  plugins: ['stylelint-order'],
  rules: {
    'comment-empty-line-before': 'never',
    'declaration-empty-line-before': 'never',
    'order/properties-order': propertyGroups.map((group) => ({
      ...group,
      emptyLineBefore: 'never',
      noEmptyLineBetween: true,
    })),
  },
};

export default stylelintConfig;
