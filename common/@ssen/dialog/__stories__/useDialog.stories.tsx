import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { useState } from 'react';
import type { DialogProps } from '../useDialog.ts';
import { useDialog } from '../useDialog.ts';
import { useESC } from '../useESC.ts';

interface SimpleDialogProps {
  message: string;
}

type SimpleDialogReturn = {
  value: number;
} | void;

function SimpleDialog({
  message,
  closeDialog,
}: DialogProps<SimpleDialogProps, SimpleDialogReturn>) {
  useESC(closeDialog);

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'white',
        padding: '20px',
        border: '1px solid black',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      }}
    >
      <p>{message}</p>
      <button
        onClick={() => closeDialog({ value: Math.round(Math.random() * 1000) })}
      >
        Close
      </button>
    </div>
  );
}

function DialogDemo(): ReactNode {
  const [openDialog, dialogNode] = useDialog(SimpleDialog);
  const [result, setResult] = useState<SimpleDialogReturn>(void 0);

  const open = async () => {
    setResult(await openDialog({ message: 'Hello from Storybook!' }));
  };

  return (
    <div>
      <p>Dialog result: {JSON.stringify(result)}</p>
      <button onClick={() => open()}>Open Dialog</button>
      {dialogNode}
    </div>
  );
}

const meta: Meta = {
  title: 'dialog',
  component: DialogDemo,
};

export default meta;
type Story = StoryObj<typeof DialogDemo>;

export const Default: Story = {};
