import * as Dialog from '@radix-ui/react-dialog'
import { useAtomValue } from 'jotai'
import React, { FormEvent } from 'react'
import { styled } from 'stitches.config'

import { stateAtom } from '@/data/wallet'

import { Button, Input } from './primitives'

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

const DialogPortal = styled(Dialog.Portal, {
  zIndex: 1000,
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
  phoneNumber,
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  onConnected: (phoneNumber: string) => void
  phoneNumber?: string
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
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <h2>Enter your phone number to get started</h2>
          <p>It has a public address and a nickname that is only visible to you.</p>
          <DialogForm onSubmit={handleLogin}>
            <Input name="fromPhoneNumber" placeholder="+1 800 888 8888" required value={phoneNumber} />
            <Button>Login</Button>
          </DialogForm>
        </DialogContent>
      </DialogPortal>
    </Dialog.Root>
  )
}
