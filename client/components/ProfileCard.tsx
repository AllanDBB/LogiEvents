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
          <Image source={{ uri: "https://ui-avatars.com/api/?name="+props.name+props.role }} style={props.profileStyles.avatarImage} />
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
