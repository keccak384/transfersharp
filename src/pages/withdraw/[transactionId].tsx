// pages/users/[uid].js
import * as Label from '@radix-ui/react-label'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { styled } from 'stitches.config'

import { Button, FlexRowFixed, PageWrapper, SmallText } from '@/components/primitives'
import { getTransactionById, Transaction } from '@/db/transactions'

export async function getServerSideProps({ params: { transactionId } }: { params: { transactionId: string } }) {
  const transaction = await getTransactionById(transactionId)

  if (!transaction) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  // if (!transaction.hash) {
  //   return {
  //     redirect: {
  //       destination: `/receive/${transaction.id}`,
  //       permanent: false,
  //     },
  //   }
  // }

  return {
    props: {
      transaction,
    },
  }
}

const ReceiveWrapper = styled('div', {
  maxWidth: '500px',
  padding: '24px',
  border: '1px solid $gray6',
  borderRadius: '24px',
})

const BigText = styled('span', {
  fontSize: '42px',
  appearance: 'none',
  color: '$gray12',
})

const MediumText = styled('span', {
  fontSize: '20px',
  appearance: 'none',
  color: '$gray12',
})

const FlexColumn = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
})

function Withdraw({ transaction }: { transaction: Transaction }) {
  return (
    <PageWrapper>
      <ReceiveWrapper>
        <FlexColumn>
          <Label.Root htmlFor="youReceived">
            <MediumText>You just received</MediumText>
          </Label.Root>
          <BigText>€920</BigText>
          <FlexRowFixed>
            <Image src="/EUR.png" alt="13" width={36} height={36} priority />
            <BigText>EURO</BigText>
          </FlexRowFixed>
          <Button
            as="a"
            href="#"
            onClick={() => {
              console.log('here')
            }}
          >
            Withdraw
          </Button>
        </FlexColumn>
      </ReceiveWrapper>
    </PageWrapper>
  )
}

export default dynamic(() => Promise.resolve(Withdraw), {
  ssr: false,
})
