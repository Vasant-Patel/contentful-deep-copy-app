import React, { useEffect, useState, ChangeEvent } from 'react';
import { DialogExtensionSDK } from 'contentful-ui-extensions-sdk';
import * as R from 'ramda';
import axios from 'axios';
import {
  Button,
  FormLabel,
  Spinner,
  ValidationMessage,
} from '@contentful/forma-36-react-components';

interface State {
  url: string;
}

export default function Dialog({ sdk }: { sdk: DialogExtensionSDK }) {
  const [entryId, setEntryId] = useState<string | undefined>();
  const [newEntryId, setNewEntryId ] =  useState<string | undefined>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const [username, setUsername] = useState<string>('');
  const [password, setPassowrd] = useState<string>('');

  console.log('SDK in dialog => ', sdk);

  useEffect(() => {
    // Ready to display our app (end loading state).
    const entryId = (R.propOr(
      null,
      'entryId',
      sdk.parameters.invocation || {}
    ) as unknown) as string;
    console.log("Invoking copy for entryId:", entryId)
    setEntryId(entryId);
    sdk.window.updateHeight();
  }, []);


  useEffect(() => {
    if (!entryId) {
      return;
    }
    console.log("Invoking copy for entryId:", entryId)
    onInit()
  }, [entryId]);

  const onOpenItem = () => {
    console.log("Opening link ...")
    window.open(`https://app.contentful.com/spaces/${sdk.ids.space}/entries/${newEntryId}`, '_blank');
  }

  const onInit = () => {
    setLoading(true);

    const endpointUrl = (R.propOr(
      null,
      'deepCopyUrl',
      sdk.parameters.installation
    ) as unknown) as string;

    const username = (R.propOr(
      null,
      'username',
      sdk.parameters.installation
    ) as unknown) as string;

    const password = (R.propOr(
      null,
      'password',
      sdk.parameters.installation
    ) as unknown) as string;

    if (!endpointUrl) {
      throw 'Please set valid config from Manage Apps => Configure';
    }

    axios
      .get(endpointUrl, {
        params: {
          entryId: entryId,
          env: sdk.ids.environment,
        },
        auth: {
          username: username || '',
          password: password || '',
        },
      })
      .then((r) => r.data)
      .then((r) => {
        console.log("Response => ", r)
        setNewEntryId(r.entryId)
      })
      .catch((e) => {
        setError(e.response?.message || e.message || e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (isLoading) {
    return (
    <div style={{ margin: 50 }}>
        Making copy, please wait  <Spinner />
    </div>
    )
  }

  if (error) {
    const err = `Failed to make duplicate copy: ${error}`
    return (
      <div style={{ margin: 50 }}>
        <ValidationMessage>{err}</ValidationMessage>
      </div>
    )
  }

  return (
    <div style={{ margin: 50 }}>
      <FormLabel htmlFor='label'>Copy created successfully!</FormLabel>
      <Button
        buttonType="positive"
        isFullWidth={true}
        disabled={!newEntryId}
        onClick={onOpenItem}
        loading={isLoading}>
        Open item
      </Button>
      <div style={{ margin: 50 }} />
    </div>
  );
}
