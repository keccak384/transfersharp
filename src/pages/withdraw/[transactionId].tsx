import dynamic from 'next/dynamic'
import Image from 'next/image'
import { styled } from 'stitches.config'

import { Button, FlexRowFixed, PageWrapper, SmallText } from '@/components/primitives'
import { CompletedTransaction, getTransactionById, isCompletedTransaction } from '@/db/transactions'

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

  if (!isCompletedTransaction(transaction)) {
    return {
      redirect: {
        destination: `/receive/${transaction.id}`,
        permanent: false,
      },
    }
  }

  return {
    props: {
      transaction,
    },
  }
}

const ReceiveWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '500px',
  width: '100%',
  padding: '24px',
  border: '1px solid $gray6',
  borderRadius: '24px',
  gap: '24px',
})

const InviteWrapper = styled(ReceiveWrapper, {
  backgroundColor: '$gray2',
  border: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '100%',
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

const Received = styled('div', {
  display: 'flex',
  flexDirection: 'column',
})

function Withdraw({ transaction }: { transaction: CompletedTransaction }) {
  return (
    <PageWrapper>
      <ReceiveWrapper>
        <InviteWrapper>
          <FlexColumn>
            <Received>
              <SmallText>You just received</SmallText>
              <BigText>€{transaction.buyAmount}</BigText>
            </Received>
            <FlexRowFixed>
              <Image src="/EUR.png" alt="13" width={20} height={20} priority />
              <MediumText>EURO</MediumText>
            </FlexRowFixed>
            <SmallText>
              <a href={`https://etherscan.io/tx/${transaction.hash}`} target="_blank" rel="noopener noreferrer">
                View transaction
              </a>
            </SmallText>
          </FlexColumn>
        </InviteWrapper>
        <Button
          as="a"
          href="#"
          onClick={() => {
            console.log('here')
          }}
        >
          Withdraw
        </Button>
      </ReceiveWrapper>
    </PageWrapper>
  )
}

export default dynamic(() => Promise.resolve(Withdraw), {
  ssr: false,
})
