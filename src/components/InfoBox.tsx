import Image from 'next/image'
import { styled } from 'stitches.config'

import { SmallText } from '@/components/primitives'

export default function InfoBox() {
  const Info = styled('div', {
    backgroundColor: '$gray12',
    borderRadius: '24px',
    width: '360px',
    height: '500px',
    position: 'relative',
    boxSizing: 'border-box',
    overflow: 'hidden',
    color: '$gray1',
    padding: '24px',
    flexDirection: 'column',
    justifyContent: 'space-between',
    display: 'none',

    '& h1': {
      zIndex: 1,
    },
    '& span': {
      zIndex: 1,
    },

    '@bp2': {
      display: 'flex',
      height: '500px',
    },
  })

  const ImageWrapper = styled(Image, {
    zIndex: 0,
  })

  return (
    <Info>
      <h1>Better international transfers.</h1>
      <ImageWrapper src="/promo.png" alt="promo" fill />
      <SmallText css={{ color: 'gray1' }}>→ LEARN MORE</SmallText>
    </Info>
  )
}
