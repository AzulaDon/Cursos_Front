export const C = {
  primary:          '#181126',
  secondary:        '#2D1F40',
  objects:          '#42378C',
  objects2:         '#4E41A6',
  accentuate:       '#D98B79',
  textPrimary:      '#EAEAF0',
  textSecondary:    '#B8B5C9',
  textDisabled:     '#6B6785',
  textOnAccent:     '#181126',
  success:          '#7ECBA1',
  successBg:        '#7ECBA122',
  danger:           '#E06C75',
  dangerBg:         '#E06C7522',
  border:           '#42378C33',
  borderHover:      '#4E41A6',
}

export const card = {
  background: C.secondary,
  borderRadius: 16,
  border: `1px solid ${C.border}`,
  padding: '1.5rem',
}

export const inputStyle = {
  background: C.primary,
  border: `1px solid ${C.border}`,
  borderRadius: 10,
  padding: '10px 14px',
  color: C.textPrimary,
  fontSize: 14,
  outline: 'none',
  width: '100%',
  fontFamily: "'DM Sans', sans-serif",
}

export const btnPrimary = {
  background: C.accentuate,
  border: 'none',
  borderRadius: 10,
  padding: '10px 22px',
  color: C.textOnAccent,
  fontSize: 14,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: "'DM Sans', sans-serif",
}

export const btnSecondary = {
  background: 'transparent',
  border: `1px solid ${C.border}`,
  borderRadius: 10,
  padding: '10px 22px',
  color: C.textSecondary,
  fontSize: 14,
  cursor: 'pointer',
  fontFamily: "'DM Sans', sans-serif",
}

export const btnDanger = {
  background: '#E06C7522',
  border: '1px solid #E06C7544',
  borderRadius: 8,
  padding: '6px 14px',
  color: '#E06C75',
  fontSize: 13,
  cursor: 'pointer',
  fontFamily: "'DM Sans', sans-serif",
}

export const btnIcon = {
  background: `${C.objects}22`,
  border: `1px solid ${C.objects}44`,
  borderRadius: 8,
  padding: '6px 14px',
  color: '#9B94E0',
  fontSize: 13,
  cursor: 'pointer',
  fontFamily: "'DM Sans', sans-serif",
}
