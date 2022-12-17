import { keyframes } from 'styled-components';
import styled from 'styled-components';

export enum Stage {
  Post,
  Position,
}

const EnterRight = keyframes`
  0% {
    opacity: 0;
            transform: translateX(100%);
  }
  100% {
    opacity: 1;
            transform: translateX(0%);
  }
`;

const EnterLeft = keyframes`
  0% {
    opacity: 0;
            transform: translateX(-100%);
  }
  100% {
    opacity: 1;
            transform: translateX(0%);
  }
`;

export const PostContainer = styled.div`
  width: 100%;
  top: 0px;
  opacity: 0;
  transform: translateX(-100%);
  position: absolute;
  display: flex;
  flex-direction: column;

  justify-content: flex-start;

  &.selected {
    opacity: 1;
    transform: translateX(0);
    position: relative;
  }
  &.cd-enter-left {
    animation: ${EnterLeft} 0.4s linear both;
  }
  &.cd-leave-left {
    animation: ${EnterLeft} 0.4s linear reverse both;
  }
`;

export const PositionContainer = styled.div`
  top: 0px;
  opacity: 0;
  transform: translateX(-100%);
  position: absolute;
  display: flex;
  flex-direction: column;
  flex: auto;
  align-items: start;
  &.selected {
    opacity: 1;
    transform: translateX(0);
    position: relative;
  }
  &.cd-enter-right {
    animation: ${EnterRight} 0.4s linear both;
  }
  &.cd-leave-right {
    animation: ${EnterRight} 0.4s linear reverse both;
  }
`;

export const Container = styled.div`
  margin-top: 10px;
  padding: 11px 0 15px;
  text-align: center;
  overflow: hidden;

  font-weight: bold;
  font-size: 15px;

  outline: 0px;
  cursor: pointer;

  color: var(--twitter);
  border-bottom: 2px solid var(--twitter);

  &:hover {
    background: var(--twitter-dark-hover);
  }
`;

export const SubmitContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const InputContainer = styled.div`
  width: 95%;
  min-height: 250px;
  margin: auto;
  position: relative;
`;

export const TextArea = styled.textarea`
  width: 100%;
  border: solid 1px grey;
  border-radius: 2px;
  box-sizing: border-box;
  padding: 0.5rem;
  margin: 0.5rem;
`;

export const Input = styled.input`
  /* border: solid 1px grey;
  border-radius: 2px; */
  box-sizing: border-box;
  padding: 0.5rem;
  margin: 0.5rem;
`;

export const Select = styled.select`
  &:focus {
    outline: 0;
  }
`;

export const Wrapper = styled.div`
  height: 100%;
  max-width: 1280px;
  margin: 0 auto;

  display: flex;
  justify-content: left;
`;
