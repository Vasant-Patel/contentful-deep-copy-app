import React, { useEffect, useState, ChangeEvent } from 'react';
import { DialogExtensionSDK } from 'contentful-ui-extensions-sdk';
import * as R from 'ramda';
import axios from 'axios';
import {
  Button,
  HelpText,
  Option,
  SelectField,
  Spinner,
  Table,
  TableRow,
  TextField,
} from '@contentful/forma-36-react-components';

interface State {
  url: string;
}

export default function Dialog({ sdk }: { sdk: DialogExtensionSDK }) {
  const [targetEnv, setTargetEnv] = useState<string | undefined>();
  const [entryId, setEntryId] = useState<string | undefined>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const [username, setUsername] = useState<string>('');
  const [password, setPassowrd] = useState<string>('');

  // backend api's ---------
  // const loadEnvironments = () => {
  //   const endpointUrl = (R.propOr(
  //     null,
  //     'deepCopyUrl',
  //     sdk.parameters.installation
  //   ) as unknown) as string;

  //   if (!endpointUrl) {
  //     throw 'Please set valid endpoint url from Manage Apps => Configure';
  //   }

  //   setLoading(true);
  //   axios
  //     .get(endpointUrl, {
  //       params: {
  //         entryId: entryId,
  //         sourceEnv: sdk.ids.environment,
  //       },
  //     })
  //     .then((r) => r.data as string[])
  //     .then((r) => setEnvironments(r))
  //     .catch((e) => setError(e.messsage || e))
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };

  console.log('SDK in dialog => ', sdk);
  const onSelectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Env selected =>', e.target.value);
    setTargetEnv(e.target.value);
  };

  const onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedValue = e.target.value;
    setUsername(updatedValue);
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedValue = e.target.value;
    setPassowrd(updatedValue);
  };

  useEffect(() => {
    // Ready to display our app (end loading state).
    const entryId = (R.propOr(
      null,
      'entryId',
      sdk.parameters.invocation || {}
    ) as unknown) as string;
    setEntryId(entryId);
    sdk.window.updateHeight();
  }, []);

  useEffect(() => {
    console.log('Error : ', error);
    if (error) {
      sdk.notifier.error(error);
    }
  }, [error]);

  const onCopyPress = () => {
    const endpointUrl = (R.propOr(
      null,
      'deepCopyUrl',
      sdk.parameters.installation
    ) as unknown) as string;

    if (!endpointUrl) {
      throw 'Please set valid endpoint url from Manage Apps => Configure';
    }

    setLoading(true);
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
      .then((r) => sdk.notifier.success(`Entry copied successfully ${r}`))
      .catch((e) => {
        setError(e.response?.message || e.message || e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (isLoading)

  return (
    <div style={{ margin: 50 }}>
      <div>
        Making copy, please wait <Spinner />
      </div>
      <div style={{ margin: 10 }} />
      <Button
        buttonType="negative"
        isFullWidth={true}
        disabled={isLoading || !targetEnv || !username || !password}
        onClick={onCopyPress}
        loading={isLoading}>
        {targetEnv ? `Copy entry to ${targetEnv} env` : 'Copy entry'}
      </Button>
      <div style={{ margin: 50 }} />
    </div>
  );
}
