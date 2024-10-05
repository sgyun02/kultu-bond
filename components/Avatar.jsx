import React from "react";
import { Image } from "react-native";
import { styled } from "nativewind";

const StyledImage = styled(Image);

export const Avatar = ({ url }) => {
  return (
    <StyledImage className="w-12 h-12 rounded-full" source={{ uri: url }} />
  );
};