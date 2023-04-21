import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomButton } from '../../../components';
import globalStyles from '../../../styles/globalStyles';

const EULAView = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();

  const isImport = route?.params?.isImport;

  const acceptHandler = () => {
    if (isImport) {
      navigation.navigate('Import');
    } else {
      navigation.navigate('Username');
    }
  };
  const declineHandler = () => {
    navigation.goBack();
    // eslint-disable-next-line no-alert
    alert(
      'If you do not accept the EULA you will not be able to use Current... Sorry!',
    );
  };

  return (
    <View
      style={[
        globalStyles.screenContainer,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={globalStyles.textH1}>End User License Agreement</Text>
        <Text style={globalStyles.textH2}>Introduction</Text>
        <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>
          This End User License Agreement (EULA) is a legal agreement between
          you and Lightning Digital Entertainment Inc. for the use of our mobile
          application current. By installing, accessing, or using out
          application, you agree to be bound by the terms and conditions of this
          EULA.
        </Text>
        <Text style={globalStyles.textH2}>Prohibited Content and Conduct</Text>
        <Text style={[globalStyles.textBodyBold, { textAlign: 'left' }]}>
          You agree not to use our application to create, upload, post, send, or
          store any content that:
        </Text>
        <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>
          * Is illegal, infringing, or fraudulent
        </Text>
        <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>
          * is defamatory, libelous, or threatening
        </Text>
        <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>
          * Is pornographic, obscene, or offensive
        </Text>
        <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>
          * Is discriminatory or promotes hate speech
        </Text>
        <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>
          * is harmful to minors
        </Text>
        <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>
          * Is intended to harass or bully others
        </Text>
        <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>
          * Is intended to impersonate others
        </Text>
        <Text style={[globalStyles.textBodyBold, { textAlign: 'left' }]}>
          You also agree not to engage in any conduct that:
        </Text>
        <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>
          * Harasses or bullies others
        </Text>
        <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>
          * Impersonates others
        </Text>
        <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>
          * le intended to intimidate or threaten others
        </Text>
        <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>
          * Is intended to promote or incite violence
        </Text>
        <Text style={globalStyles.textH2}>Consequences of Violation</Text>
        <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>
          Any violation of this EULA, including the prohibited content and
          conduct outlined above, may result in the termination of your access
          to our application.
        </Text>
        <Text style={globalStyles.textH2}>
          Disclaimer of Warranties and Limitation of Liability
        </Text>
        <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>
          Our application is provided -as is- and -as available- without
          warranty of any kind, either express or implied, including but not
          limited to the implied warranties of merchantability and fitness for a
          particular purpose. We do not guarantee that our application will be
          uninterrupted or error-free. In no event shall Lightning Digital
          Entertainment Inc. be liable for any damages whatsoever, including but
          not limited to direct, indirect, special, incidental, or consequential
          damages, arising out of or in connection with the use or inability to
          use our application.
        </Text>
        <Text style={globalStyles.textH2}>Changes to EULA</Text>
        <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>
          We reserve the right to undate or modifv this EULA at an time and
          without prior notice. Your continued use of our application following
          any changes to this EULA will be deemed to be your acceptance of such
          changes.
        </Text>
        <Text style={globalStyles.textH2}>Contact Information</Text>
        <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>
          If you have any questions about this EULA, please contact us at
          hello@getcurrent.io
        </Text>
        <Text style={globalStyles.textH2}>Acceptance of Terms</Text>
        <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>
          By using our Application, you signify your acceptance of this EULA. If
          you do not agree to this EULA, you may not use our Application.
        </Text>
        <View
          style={{
            flexDirection: 'column',
            width: '100%',
            justifyContent: 'space-evenly',
            marginVertical: 16,
          }}
        >
          <CustomButton
            text="Accept"
            containerStyles={{ marginBottom: 16 }}
            buttonConfig={{ onPress: acceptHandler }}
          />
          <CustomButton
            text="Decline"
            buttonConfig={{ onPress: declineHandler }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default EULAView;
