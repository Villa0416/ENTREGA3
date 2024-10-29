import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import { Input } from "../components";
import { Btn } from "../components/Btn";
import { COLORS } from "../style/colors";
import { GLOBAL_STYLES } from "../style/globalStyles";
import { CustomText } from "../components/CustomText";
import {
  signupUser,
  signIn,
  selectAuthStatus,
  selectAuthUserID,
} from "../store/auth";

const mapStateToProps = (state) => ({
  authStatus: selectAuthStatus(state),
  userID: selectAuthUserID(state),
});

export const AuthForm = connect(mapStateToProps, {
  signupUser,
  signIn,
})(({ signIn, signupUser }) => {
  const [ind, setInd] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [fields, setFields] = useState({
    username: "",
    email: "",
    password: "",
  });

  const fieldChangeHandler = (name, value) => {
    setFields((fields) => ({
      ...fields,
      [name]: value.trim(),
    }));
  };

  return (
    <View style={styles.container}>
      <CustomText weight="bold" style={{ fontSize: 34, marginBottom: 40 }}>
        {isLogin ? "Login" : "Sign up"}
      </CustomText>
      {ind ? null : (
        <ActivityIndicator
          style={styles.indicator}
          size={70}
          color={COLORS.PRIMARY}
        />
      )}
      <ScrollView>
        {!isLogin && (
          <Input
            name={"Name"}
            onChangeHandler={(value) => fieldChangeHandler("username", value)}
            value={fields.username}
          />
        )}

        <Input
          name={"Email"}
          onChangeHandler={(value) => fieldChangeHandler("email", value)}
          value={fields.email}
          type="email"
        />
        <Input
          name={"Password"}
          onChangeHandler={(value) => fieldChangeHandler("password", value)}
          value={fields.password}
          secureTextEntry={true}
        />

        {!isLogin && (
          <TouchableOpacity
            style={styles.redirectTo}
            onPress={() => setIsLogin(true)}
          >
            <CustomText style={styles.toSignIntext}>
              Already have an account?
            </CustomText>
            <Image
              style={{ width: 15, height: 6 }}
              source={{ uri: "../../assets/rightArrow.png" }}
            />
          </TouchableOpacity>
        )}

        <Btn
          btnName={isLogin ? "LOGIN" : "SIGN UP"}
          width={"100%"}
          height={48}
          bgColor={COLORS.PRIMARY}
          titleStyle={{ color: "#F5F5F5" }}
          onPress={() => {
            isLogin ? signIn(fields) : signupUser(fields), setInd(false);
          }}
        />
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: GLOBAL_STYLES.PADDING,
    backgroundColor: COLORS.BACKGROUND,
  },
  signUpContainer: {
    width: "100%",
    alignItems: "center",
  },
  redirectTo: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 25,
  },
  toSignIntext: {
    color: "white",
    marginRight: 8,
  },
  indicator: {
    position: "absolute",
    top: 50,
    left: 150,
    zIndex: 1,
  },
});
