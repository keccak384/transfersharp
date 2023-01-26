import { styled } from 'stitches.config'

export const Button = styled('button', {
  backgroundColor: '$gray12',
  color: '$gray1',
  border: 'none',
  padding: '16px',
  borderRadius: '40px',
  textAlign: 'center',
  fontSize: '20px',
  fontWeight: '500',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  width: '100%',
  '&:hover': {
    opacity: 0.6,
  },
})

export const PendingButton = styled(Button, {
  opacity: 0.4,
  pointerEvents: 'none',

export const InviteButton = styled(Button, {
  backgroundColor: '$blue10',
})

export const SuccessButton = styled(Button, {
  backgroundColor: '$green9',
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
