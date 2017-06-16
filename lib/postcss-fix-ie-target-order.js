import postcss from 'postcss'

const reIeTarget = /\(-ms-high-contrast:\s?none\),\s?\(-ms-high-contrast:\s?active\)$/
const fixIeTargetOrder = postcss.plugin('fixIeTargetOrder', () => (css) => {
  let firstAtRule

  css.walkAtRules('media', (atRule) => {
    const { parent } = atRule

    if (parent.type !== 'root') {
      return
    }

    if (!firstAtRule) {
      firstAtRule = atRule
    }

    const queryList = atRule.params

    if (reIeTarget.test(queryList)) {
      parent.insertBefore(firstAtRule, atRule.clone())

      atRule.remove()
    }
  })

  return css
})

// @todo: this temporarely fixes css-mqpacker incomplete sorting feature
export default fixIeTargetOrder
