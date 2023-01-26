import { keyframes } from '@stitches/react'
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
})

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
  '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
    '-webkit-appearance': 'none',
    margin: 0,
  },
  '-moz-appearance': 'textfield',
})

export const FlexRow = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  gap: '$2',
})

export const FlexRowFixed = styled(FlexRow, {
  justifyContent: 'flex-start',
})

export const DarkText = styled('span', { color: '$gray12' })

export const InputWrapper = styled('div', {
  padding: '24px',
  border: '1px solid $gray5',
  borderRadius: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  color: '$gray12',
})

const spin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
})

export const Spinner = styled('span', {
  width: '16px',
  height: '16px',
  border: '2px solid $blue9',
  borderBottom: '2px solid #fff',
  borderRadius: '50%',
  display: 'inline-block',
  boxSizing: 'border-box',
  animation: `${spin} 1000ms ease-in-out infinite`,
})

export const PageWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  alignSelf: 'center',
  margin: 'auto',
  backgroundColor: 'white',
  color: 'black',
  padding: '0 0 50px',
})

export const StyledSendForm = styled('form', {
  fontSize: '$3',
  border: '0',
  maxWidth: '420px',
  display: 'flex',
  flexDirection: 'column',
  gap: '$1',
})

export const SmallText = styled('span', {
  fontSize: '$1',
  color: '$gray9',
})

export const PendingText = styled(SmallText, {
  color: '$blue10',
})

export const SuccessText = styled(SmallText, {
  color: '$green9',
})
