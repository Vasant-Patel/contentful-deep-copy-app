import React, { useEffect, useState } from 'react';
import { AppExtensionSDK } from 'contentful-ui-extensions-sdk';
import * as R from 'ramda';
// Use components from Contentful's design system, Forma 36: https://ctfl.io/f36
import { TextField } from '@contentful/forma-36-react-components';


export default function Config({ sdk }: { sdk: AppExtensionSDK }) {
  const [deepCopyUrl, setDeepCopyUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const configure = () => {
    return {
      // Parameters to be persisted as the app configuration.
      parameters: { deepCopyUrl, username, password },
    };
  };


  const onDeepCopyUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedValue = e.target.value;
    setDeepCopyUrl(updatedValue);
  };

  const onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedValue = e.target.value;
    setUsername(updatedValue);
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedValue = e.target.value;
    setPassword(updatedValue);
  };

  useEffect(() => {
    sdk.app.onConfigure(configure);
  }, [deepCopyUrl]);

  useEffect(() => {
    // Ready to display our app (end loading state).
    sdk.app.getParameters().then((parameters) => {
      const deepCopyUrl = (R.propOr('', 'deepCopyUrl', parameters || {}) as unknown) as string;
      const user = (R.propOr('', 'username', parameters || {}) as unknown) as string;
      const pwd = (R.propOr('', 'password', parameters || {}) as unknown) as string;
      setDeepCopyUrl(deepCopyUrl);
      setUsername(user);
      setPassword(pwd);
      sdk.app.setReady();
    });
  }, []);

  return (
    <div style={{ margin: 50 }}>
      <TextField
        name="urlInput"
        id="urlInput"
        value={deepCopyUrl}
        onChange={onDeepCopyUrlChange}
        labelText="Endpoint url for deep copy"></TextField>
      <div style={{ margin: 30 }} />
      <TextField
        name="username"
        id="username"
        value={username}
        onChange={onUsernameChange}
        labelText="Username for cloud function access"></TextField>
      <div style={{ margin: 30 }} />
      <TextField
        textInputProps={{type: "password"}}
        name="password"
        id="password"
        value={password}
        onChange={onPasswordChange}
        labelText="Password for cloud function access"></TextField>
    </div>
  );
}
