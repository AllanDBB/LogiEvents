import React from 'react';
import { 
  View, 
  Text, 
  Image 
} from 'react-native';

type ProfileCardProps = {
  name: string;
  role: string;
  avatar?: string;
  profileStyles : any;
};

function ProfileCard(props: ProfileCardProps) {
  return (
    <View style={props.profileStyles.container}>
      <View style={props.profileStyles.avatarContainer}>
        {props.avatar ? (
          <Image source={{ uri: props.avatar }} style={props.profileStyles.avatarImage} />
        ) : (
          <Text style={props.profileStyles.initials}>NA</Text>
        )}
      </View>
      <View>
        <Text style={props.profileStyles.name}>{props.name.toUpperCase()}</Text>
        <Text style={props.profileStyles.role}>{props.role.toUpperCase()}</Text>
      </View>
    </View>
  );
}

export default ProfileCard;
