import * as Dialog from '@radix-ui/react-dialog'
import { useAtomValue } from 'jotai'
import React, { FormEvent } from 'react'
import { styled } from 'stitches.config'

import { stateAtom } from '@/data/wallet'

import { Input, SendButton } from './primitives'

const DialogOverlay = styled(Dialog.Overlay, {
  position: 'fixed',
  inset: '0',
  backgroundColor: '#00000040',
  animation: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
})

const DialogContent = styled(Dialog.Content, {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxWidth: '450px',
  maxHeight: '85vh',
  backgroundColor: 'white',
  borderRadius: '20px',
  animation: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
  padding: '25px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
})

const DialogForm = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
})

export default function ConnectWithPhoneDialog({
  isOpen,
  setIsOpen,
  onConnected,
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  onConnected: (phoneNumber: string) => void
}) {
  const magic = useAtomValue(stateAtom)

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      const phoneNumber = new FormData(e.currentTarget).get('fromPhoneNumber')?.toString()

      if (!phoneNumber) {
        throw new Error('Phone is required')
      }

      await magic.auth.loginWithSMS({ phoneNumber })

      onConnected(phoneNumber)
    } catch (error) {
      console.log(`Error while logging in with MagicLink: ${error}`)
    } finally {
      setIsOpen(false)
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Portal>
        <DialogOverlay />
        <DialogContent>
          <h2>
            Enter your <span>phone number</span> to get started
          </h2>
          <p>It has a public address and a nickname that is only visible to you.</p>
          <DialogForm onSubmit={handleLogin}>
            <Input name="fromPhoneNumber" placeholder="+1 800 888 8888" required />
            <SendButton>Login</SendButton>
          </DialogForm>
        </DialogContent>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
