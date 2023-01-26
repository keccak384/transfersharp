import { styled } from 'stitches.config'

export const SendButton = styled('button', {
  backgroundColor: '$gray12',
  color: '$gray1',
  border: 'none',
  padding: '16px',
  borderRadius: '40px',
  textAlign: 'center',
  fontSize: '20px',
  fontWeight: '500',
  display: 'inline-block',
  cursor: 'pointer',
  width: '100%',
  '&:hover': {
    backgroundColor: '$blue5',
  },
})

export const Input = styled('input', {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  backgroundColor: 'transparent',
  border: 'none',
  fontSize: '42px',
  appearance: 'none',
  color: '$gray12',
  width: '100%',
  '&::placeholder': {
    color: '$gray5',
  },
  '&:focus': {
    outline: 'none',
  },
})
