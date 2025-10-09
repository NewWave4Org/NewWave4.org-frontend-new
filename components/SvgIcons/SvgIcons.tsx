import React from 'react'
import { CUSTOM_ICON_REF, CustomIconRef } from './IconRef';

interface Props {
  icon: CUSTOM_ICON_REF;
  baseClassName?: string;
}

function SvgIcons(props: Props) {

  const { icon, baseClassName } = props;
  const CustomIcon = CustomIconRef[icon];
  return (
    <div className={baseClassName}>
      <CustomIcon />
    </div>
  )
}

export default SvgIcons;