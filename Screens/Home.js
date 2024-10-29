import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  FlatList,
  YellowBox,
} from "react-native";
import { connect } from "react-redux";
import { Btn } from "../components/Btn";
import { CustomText } from "../components/CustomText";
import { getCurrentUserData } from "../store/users";
import { ProductCard } from "../components/ProductCard";
import {
  selectSaleProductData,
  getOnSaleProducts,
  selectNewProductData,
  getNewData,
  getFilteredProducts,
} from "../store/products";
import { COLORS } from "../style/colors";
import homeImage from "../assets/homeImage.png";
import banner from "../assets/Small_banner.png";

const mapStateToProps = (state) => ({
  saleProducts: selectSaleProductData(state),
  newProducts: selectNewProductData(state),
});
const Home = connect(mapStateToProps, {
  getOnSaleProducts,
  getNewData,
  getCurrentUserData,
  getFilteredProducts,
})(
  ({
    getNewData,
    newProducts,
    saleProducts,
    getOnSaleProducts,
    navigation,
    getCurrentUserData,
    getFilteredProducts,
  }) => {
    YellowBox.ignoreWarnings(["Setting a timer"]);
    const [showSale, setShowSale] = useState(false);

    const handleNewProducts = async () => {
      try {
        await getNewData("isNew");
      } catch (error) {
        console.log("getNewData", error);
      }
    };
    const handleOnSaleProducts = async () => {
      setShowSale(true);
      try {
        await getOnSaleProducts("sale");
      } catch (error) {
        console.log("getOnSaleProducts", error);
      }
    };
    const handleGetCurrentUserData = async () => {
      try {
        const user = await getCurrentUserData();
        console.log("user home", user);
      } catch (error) {
        console.log("getCurrentUserData", error);
      }
    };

    useEffect(() => {
      handleNewProducts();
      handleGetCurrentUserData();
    }, []);

    return (
      <ScrollView style={styles.container}>
        {showSale ? (
          <>
            <Image source={banner} style={{ width: "100%", height: 196 }} />
            <View style={styles.newItemsWrap}>
              <CustomText style={styles.categoryTitle} weight="bold">
                Sale
              </CustomText>
              <CustomText style={styles.description}>
                Super Summer Sale
              </CustomText>
              <FlatList
                horizontal
                contentContainerStyle={{
                  paddingTop: 15,
                }}
                data={saleProducts}
                renderItem={({ item }) => (
                  <ProductCard
                    product={item}
                    isOnSale={true}
                    isInCatalog={true}
                    navigation={navigation}
                    onPress={() =>
                      navigation.navigate("SingleProduct", {
                        product: item,
                        products: saleProducts.filter(
                          (product) =>
                            product.categoryName === item.categoryName
                        ),
                      })
                    }
                  />
                )}
                keyExtractor={(item) => item.productType}
              />
            </View>
          </>
        ) : (
          <View style={styles.imageWrapper}>
            <Image source={homeImage} style={{ width: "100%", height: 480 }} />
            <CustomText style={styles.title} weight="bold">
              Fashion sale
            </CustomText>
            <View style={styles.btn}>
              <Btn
                btnName="Check"
                bgColor={COLORS.PRIMARY}
                height={36}
                width={160}
                onPress={() => handleOnSaleProducts()}
              />
            </View>
          </View>
        )}
        <View style={styles.newItemsWrap}>
          <CustomText style={styles.categoryTitle} weight="bold">
            New
          </CustomText>
          <CustomText style={styles.description}>
            You've never seen it before
          </CustomText>

          <FlatList
            horizontal
            contentContainerStyle={{
              paddingTop: 15,
            }}
            data={newProducts}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                isNew={true}
                isInCatalog={true}
                navigation={navigation}
                onPress={() =>
                  navigation.navigate("SingleProduct", {
                    product: item,
                    products: newProducts.filter(
                      (product) => product.categoryName === item.categoryName
                    ),
                  })
                }
              />
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      </ScrollView>
    );
  }
);

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageWrapper: {
    width: "100%",
  },
  title: {
    fontSize: 48,
    position: "absolute",
    bottom: 88,
    left: 15,
    width: 190,
    color: COLORS.TEXT,
  },
  btn: {
    position: "absolute",
    left: 15,
    bottom: 34,
  },
  newItemsWrap: {
    backgroundColor: COLORS.BACKGROUND,
    paddingLeft: 15,
    paddingTop: 20,
    flex: 1,
  },
  categoryTitle: {
    fontSize: 34,
    color: COLORS.TEXT,
  },
  description: {
    color: COLORS.GRAY,
    fontSize: 11,
    marginBottom: 10,
  },
});
