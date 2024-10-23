import React from 'react';
import { View, StyleSheet } from 'react-native';

interface PhrenicPoolSpheresProps {
  total: number;
  used: number;
}

const PhrenicPoolSpheres: React.FC<PhrenicPoolSpheresProps> = ({ total, used }) => {
  return (
    <View style={styles.container}>
      {[...Array(total)].map((_, index) => (
        <View
          key={index}
          style={[
            styles.sphere,
            total - index - 1 < total - used ? styles.fullSphere : styles.usedSphere
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  sphere: {
    width: 20,
    height: 20,
    borderRadius: 10,
    margin: 5,
  },
  fullSphere: {
    backgroundColor: '#3498db',
  },
  usedSphere: {
    borderWidth: 2,
    borderColor: '#3498db',
  },
});

export default PhrenicPoolSpheres;
