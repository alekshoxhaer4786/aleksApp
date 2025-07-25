import React from 'react';
import type { FC } from 'react';
import {
  NotificationDetail,
  AvatarTokenSize,
  AvatarToken,
  BadgeWrapper,
  BadgeWrapperPosition,
  Text,
} from '../../component-library';
import {
  BackgroundColor,
  BorderColor,
  FontWeight,
  TextVariant,
  TextColor,
} from '../../../helpers/constants/design-system';

type BadgeProps = {
  src: string;
};

type IconProps = {
  src: string;
};

export type NotificationDetailAssetProps = {
  icon: IconProps;
};

const createTextComponent = (variant, fontWeight, color, children) => (
    <Text variant={variant} fontWeight={fontWeight} color={color}>
      {children}
    </Text>
);

export const NotificationDetailAsset: FC<NotificationDetailAssetProps> = ({
    icon
}) => {

};
