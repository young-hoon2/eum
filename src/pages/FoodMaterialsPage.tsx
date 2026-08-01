import { useEffect, useState } from "react";
import Input from "../components/Input";
import type {
  FoodMaterialDto,
  FoodMaterialPageResponse,
  FoodMaterialDeleteResponse,
} from "../types/dto/FoodMaterialDto";
import "../pages/css/FoodMaterialsPage.css";
import client from "../api/client";
import Button from "../components/Button";
import {
  getExpNotice,
  getStockNotice,
  type ExpNoticeResponse,
  type StockNoticeResponse,
} from "../features/notice/api";

// const foodMaterialData: FoodMaterialDto[] =[{
//   foodMaterialId: "FM011",
//   foodMaterialName: "삼겹살",
//   foodCategory: "육류",
//   foodMaterialCount: 10,
//   foodMaterialWeight: 500,
//   totalWeight: 5000,
//   foodMaterialPrice: 30000,
//   foodMaterialType: "고체",
//   vender: "고기 가게",
//   incomeDate: "2026-06-25",
//   expirationDate: "2026-07-10",
// },
// {
//   foodMaterialId: "FM010",
//   foodMaterialName: "앞다리살",
//   foodCategory: "육류",
//   foodMaterialCount: 5,
//   foodMaterialWeight: 600,
//   totalWeight: 3000,
//   foodMaterialPrice: 18000,
//   foodMaterialType: "고체",
//   vender: "정육식품",
//   incomeDate: "2026-06-28",
//   expirationDate: "2026-07-04",
// },
// {
//   foodMaterialId: "FM009",
//   foodMaterialName: "육포",
//   foodCategory: "가공식품",
//   foodMaterialCount: 20,
//   foodMaterialWeight: 500,
//   totalWeight: 10000,
//   foodMaterialPrice: 12000,
//   foodMaterialType: "고체",
//   vender: "고기식당",
//   incomeDate: "2026-06-30",
//   expirationDate: "2026-11-27",
// },
// {
//   foodMaterialId: "FM008",
//   foodMaterialName: "밥",
//   foodCategory: "곡류",
//   foodMaterialCount: 20,
//   foodMaterialWeight: 500,
//   totalWeight: 10000,
//   foodMaterialPrice: 12000,
//   foodMaterialType: "고체",
//   vender: "우리쌀",
//   incomeDate: "2026-06-30",
//   expirationDate: "2026-12-11",},
// {
//   foodMaterialId: "FM007",
//   foodMaterialName: "돈까스 고기",
//   foodCategory: "육류",
//   foodMaterialCount: 20,
//   foodMaterialWeight: 500,
//   totalWeight: 10000,
//   foodMaterialPrice: 12000,
//   foodMaterialType: "고체",
//   vender: "정육식품",
//   incomeDate: "2026-06-30",
//   expirationDate: "2026-11-20",},
// {
//   foodMaterialId: "FM006",
//   foodMaterialName: "목살",
//   foodCategory: "육류",
//   foodMaterialCount: 20,
//   foodMaterialWeight: 500,
//   totalWeight: 10000,
//   foodMaterialPrice: 12000,
//   foodMaterialType: "고체",
//   vender: "정육식당",
//   incomeDate: "2026-06-30",
//   expirationDate: "2026-07-31",},
// {
//   foodMaterialId: "FM005",
//   foodMaterialName: "살치살",
//   foodCategory: "육류",
//   foodMaterialCount: 20,
//   foodMaterialWeight: 500,
//   totalWeight: 10000,
//   foodMaterialPrice: 12000,
//   foodMaterialType: "고체",
//   vender: "정육식당",
//   incomeDate: "2026-06-30",
//   expirationDate: "2026-07-30",},
// {
//   foodMaterialId: "FM004",
//   foodMaterialName: "뒷다리살",
//   foodCategory: "육류",
//   foodMaterialCount: 20,
//   foodMaterialWeight: 500,
//   totalWeight: 10000,
//   foodMaterialPrice: 12000,
//   foodMaterialType: "고체",
//   vender: "정육식당",
//   incomeDate: "2026-06-30",
//   expirationDate: "2026-12-14",},
// {
//   foodMaterialId: "FM003",
//   foodMaterialName: "소면",
//   foodCategory: "면류",
//   foodMaterialCount: 20,
//   foodMaterialWeight: 500,
//   totalWeight: 10000,
//   foodMaterialPrice: 12000,
//   foodMaterialType: "고체",
//   vender: "사리가게",
//   incomeDate: "2026-06-30",
//   expirationDate: "2026-12-01",},
// {
//   foodMaterialId: "FM002",
//   foodMaterialName: "면",
//   foodCategory: "면류",
//   foodMaterialCount: 20,
//   foodMaterialWeight: 500,
//   totalWeight: 10000,
//   foodMaterialPrice: 12000,
//   foodMaterialType: "고체",
//   vender: "사리가게",
//   incomeDate: "2026-06-30",
//   expirationDate: "2026-12-27",},
// {
//   foodMaterialId: "FM001",
//   foodMaterialName: "치즈",
//   foodCategory: "발효식품",
//   foodMaterialCount: 20,
//   foodMaterialWeight: 500,
//   totalWeight: 10000,
//   foodMaterialPrice: 12000,
//   foodMaterialType: "고체",
//   vender: "꾸덕꾸덕",
//   incomeDate: "2026-06-30",
//   expirationDate: "2026-12-21",}
// ]

type AlertStatus = "danger" | "warning" | "";

function formatDate(dateString: string) {
  if (!dateString) return "";
  return dateString.substring(0, 10);
}

function formatNumber(value: number) {
  return value.toLocaleString();
}

function formatMoney(value: number) {
  return `${value.toLocaleString()}원`;
}

function getRemainingDays(dateString: string) {
  const formattedDate = formatDate(dateString);

  if (!formattedDate) return null;

  const [year, month, day] = formattedDate.split("-").map(Number);

  if (!year || !month || !day) return null;

  const targetDate = new Date(year, month - 1, day);
  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  return Math.round((targetDate.getTime() - todayStart.getTime()) / 86400000);
}

function getColumnClassName(columnKey: string) {
  return `food-materials-table__column--${columnKey}`;
}

interface FoodMaterialColumn {
  key: string;
  label: string;
  getValue: (foodMaterial: FoodMaterialDto) => string | number;
}

const foodMaterialColumnList: FoodMaterialColumn[] = [
  {
    key: "foodMaterialId",
    label: "식자재 번호",
    getValue: (foodMaterial) => foodMaterial.foodMaterialId,
  },
  {
    key: "foodMaterialName",
    label: "식자재명",
    getValue: (foodMaterial) => foodMaterial.foodMaterialName,
  },
  {
    key: "foodCategory",
    label: "카테고리",
    getValue: (foodMaterial) => foodMaterial.foodCategory,
  },
  {
    key: "foodMaterialCount",
    label: "수량",
    getValue: (foodMaterial) => foodMaterial.foodMaterialCount,
  },
  {
    key: "foodMaterialWeight",
    label: "단위 중량(g)",
    getValue: (foodMaterial) =>
      `${formatNumber(foodMaterial.foodMaterialWeight)}g`,
  },
  {
    key: "totalWeight",
    label: "총중량(g)",
    getValue: (foodMaterial) => `${formatNumber(foodMaterial.totalWeight)}g`,
  },
  {
    key: "foodMaterialPrice",
    label: "매입 가격",
    getValue: (foodMaterial) => formatMoney(foodMaterial.foodMaterialPrice),
  },
  {
    key: "foodMaterialType",
    label: "품목 유형",
    getValue: (foodMaterial) => foodMaterial.foodMaterialType,
  },
  {
    key: "vender",
    label: "구입처",
    getValue: (foodMaterial) => foodMaterial.vender,
  },
  {
    key: "incomeDate",
    label: "매입일",
    getValue: (foodMaterial) => formatDate(foodMaterial.incomeDate),
  },
  {
    key: "expirationDate",
    label: "유통기한",
    getValue: (foodMaterial) => formatDate(foodMaterial.expirationDate),
  },
];

function FoodMaterialsPage() {
  const [keyword, setKeyword] = useState("");
  const [sortType, setSortType] = useState("idDesc");
  // const[allFoodMaterials, setAllFoodMaterials] = useState<FoodMaterialDto[]>(foodMaterialData);
  const [foodMaterials, setFoodMaterials] = useState<FoodMaterialDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [expSetting, setExpSetting] = useState<ExpNoticeResponse | null>(null);
  const [stockSetting, setStockSetting] = useState<StockNoticeResponse | null>(
    null,
  );

  async function loadFoodMaterials(nextKeyword: string, nextSortType: string) {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const res = await client.get<FoodMaterialPageResponse>(
        "/api/foodmaterials",
        {
          params: {
            sort: nextSortType,
            page: 1,
            size: 10,
            keyword: nextKeyword,
          },
        },
      );
      setFoodMaterials(res.data.foodList);

      setCurrentPage(res.data.currentPage);
      setTotalPage(res.data.totalPage);
    } catch (e) {
      console.error("식자재 목록 불러오기 실패", e);
      setErrorMessage("식자재 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }

  async function loadNoticeSettings() {
    try {
      const [nextExpSetting, nextStockSetting] = await Promise.all([
        getExpNotice(),
        getStockNotice(),
      ]);

      setExpSetting(nextExpSetting);
      setStockSetting(nextStockSetting);
    } catch (e) {
      console.error("알림 설정 불러오기 실패", e);
    }
  }

  useEffect(() => {
    void loadFoodMaterials("", "idDesc");
    void loadNoticeSettings();
  }, []);

  // const sortFoodMaterials=(targetFoodMaterials:FoodMaterialDto[], targetSortType:string) =>{
  //   const sortedFoodMaterials=[...targetFoodMaterials];
  //   switch(targetSortType){
  //     case "idAsc":
  //       sortedFoodMaterials.sort((a,b)=>a.foodMaterialId.localeCompare(b.foodMaterialId));
  //       break;
  //     case "idDesc":
  //       sortedFoodMaterials.sort((a,b)=>b.foodMaterialId.localeCompare(a.foodMaterialId));
  //       break;
  //     case "expAsc":
  //       sortedFoodMaterials.sort((a,b)=>a.expirationDate.localeCompare(b.expirationDate));
  //       break;
  //     case "expDesc":
  //       sortedFoodMaterials.sort((a,b)=>b.expirationDate.localeCompare(a.expirationDate));
  //       break;
  //     default:
  //       break;}
  //   return sortedFoodMaterials;
  // if(targetSortType==="idAsc"){
  //   sortedFoodMaterials.sort((a,b)=>a.foodMaterialId.localeCompare(b.foodMaterialId));
  // }else if(targetSortType==="idDesc"){
  //   sortedFoodMaterials.sort((a,b)=>b.foodMaterialId.localeCompare(a.foodMaterialId));
  // }else if(targetSortType==="expAsc"){
  //   sortedFoodMaterials.sort((a,b)=>a.expirationDate.localeCompare(b.expirationDate));
  // }else if(targetSortType==="expDesc"){
  //   sortedFoodMaterials.sort((a,b)=>b.expirationDate.localeCompare(a.expirationDate));
  // }
  // return sortedFoodMaterials;
  // }

  function getExpirationAlertStatus(
    foodMaterial: FoodMaterialDto,
  ): AlertStatus {
    if (!expSetting?.expAlert || !foodMaterial.expirationDate) return "";

    const remainingDays = getRemainingDays(foodMaterial.expirationDate);

    if (remainingDays === null) return "";
    if (remainingDays <= 0) return "danger";
    if (remainingDays <= expSetting.expDays) return "warning";

    return "";
  }

  function getStockAlertStatus(foodMaterial: FoodMaterialDto): AlertStatus {
    if (!stockSetting?.foodmAlert) return "";

    if (foodMaterial.totalWeight <= 0) return "danger";
    if (foodMaterial.totalWeight <= stockSetting.foodmLimit) {
      return "warning";
    }

    return "";
  }

  function getRowAlertStatus(foodMaterial: FoodMaterialDto): AlertStatus {
    const expirationStatus = getExpirationAlertStatus(foodMaterial);
    const stockStatus = getStockAlertStatus(foodMaterial);

    if (expirationStatus === "danger" || stockStatus === "danger") {
      return "danger";
    }

    if (expirationStatus === "warning" || stockStatus === "warning") {
      return "warning";
    }

    return "";
  }

  function getRowClassName(foodMaterial: FoodMaterialDto) {
    const rowAlertStatus = getRowAlertStatus(foodMaterial);

    return rowAlertStatus
      ? `food-materials-table__row food-materials-table__row--${rowAlertStatus}`
      : "food-materials-table__row";
  }

  function getCellClassName(foodMaterial: FoodMaterialDto, columnKey: string) {
    const classNames = [
      "food-materials-table__cell",
      getColumnClassName(columnKey),
    ];

    const alertStatus =
      columnKey === "expirationDate"
        ? getExpirationAlertStatus(foodMaterial)
        : columnKey === "totalWeight"
          ? getStockAlertStatus(foodMaterial)
          : "";

    if (alertStatus) {
      classNames.push(`food-materials-table__cell--${alertStatus}`);
    }

    return classNames.join(" ");
  }

  function onSortChange(nextSortType: string) {
    setSortType(nextSortType);
    loadFoodMaterials(keyword.trim(), nextSortType);
  }

  function onSearch() {
    loadFoodMaterials(keyword.trim(), sortType);
  }

  function onAllList() {
    setKeyword("");
    loadFoodMaterials("", sortType);
  }

  async function onDelete(foodMaterialId: string) {
    const isConfirmed = window.confirm("이 식자재를 삭제하겠습니까?");

    if (!isConfirmed) {
      return;
    }

    try {
      setErrorMessage("");

      await client.delete<FoodMaterialDeleteResponse>(
        `/api/foodmaterials/${foodMaterialId}`,
      );

      loadFoodMaterials(keyword.trim(), sortType);
    } catch (e) {
      console.error("식자재 삭제 실패", e);

      setErrorMessage("식자재 삭제에 실패했습니다.");
    }

    // const nextAllFoodMaterials=allFoodMaterials.filter((foodMaterial)=>foodMaterial.foodMaterialId !== foodMaterialId)
    // setAllFoodMaterials(nextAllFoodMaterials);

    // const nextFoodMaterials=nextAllFoodMaterials.filter((foodMaterial)=>foodMaterial.foodMaterialName.includes(keyword))
    // const sortedNextFoodMaterials=sortFoodMaterials(nextFoodMaterials,sortType)
    // setFoodMaterials(sortedNextFoodMaterials);
  }

  async function loadNextFoodMaterials() {
    if (isLoading || isLoadingMore) return;

    if (currentPage >= totalPage) return;

    try {
      setIsLoadingMore(true);

      const res = await client.get<FoodMaterialPageResponse>(
        "/api/foodmaterials",
        {
          params: {
            sort: sortType,
            page: currentPage + 1,
            size: 10,
            keyword: keyword.trim(),
          },
        },
      );

      setFoodMaterials((previousFoodMaterials) => [
        ...previousFoodMaterials,
        ...res.data.foodList,
      ]);

      setCurrentPage(res.data.currentPage);
    } catch (e) {
      console.error("다음 식자재 목록 불러오기 실패", e);
      setErrorMessage("다음 식자재 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoadingMore(false);
    }
  }

  function onTableScroll(event: React.UIEvent<HTMLDivElement>) {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;

    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 40;

    if (isNearBottom) {
      loadNextFoodMaterials();
    }
  }

  return (
    <div className="container">
      <main className="main">
        <h1>식자재 조회</h1>
        <div className="food-materials-toolbar">
          <Input
            inputType="text"
            value={keyword}
            onChange={setKeyword}
            placeholder="식자재명을 입력하세요"
            width={250}
            height={30}
          />

          <label className="food-materials-sort">
            <select
              className="food-materials-sort-select"
              value={sortType}
              onChange={(event) => onSortChange(event.target.value)}
              style={{ height: "36px" }}
            >
              <option value="idAsc">식자재 번호 오름차순</option>
              <option value="idDesc">식자재 번호 내림차순</option>
              <option value="expAsc">유통기한 임박순</option>
              <option value="expDesc">유통기한 여유순</option>
            </select>
          </label>
          <Button type="button" onClick={onSearch}>
            검색
          </Button>
          <Button type="button" onClick={onAllList}>
            전체 조회
          </Button>
        </div>

        {errorMessage && <p role="alert">{errorMessage}</p>}

        <div className="food-materials-table-wrap" onScroll={onTableScroll}>
          <table className="food-materials-table">
            <thead>
              <tr>
                {foodMaterialColumnList.map((column) => (
                  <th
                    key={column.key}
                    className={`food-materials-table__header-cell ${getColumnClassName(column.key)}`}
                  >
                    {column.label}
                  </th>
                ))}
                <th
                  className={`food-materials-table__header-cell ${getColumnClassName("delete")}`}
                >
                  삭제
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    className="food-materials-table__message-cell"
                    colSpan={foodMaterialColumnList.length + 1}
                  >
                    식자재 목록을 불러오는 중입니다.
                  </td>
                </tr>
              ) : foodMaterials.length === 0 ? (
                <tr>
                  <td
                    className="food-materials-table__message-cell"
                    colSpan={foodMaterialColumnList.length + 1}
                  >
                    조회된 식자재가 없습니다.
                  </td>
                </tr>
              ) : (
                foodMaterials.map((foodMaterial) => (
                  <tr
                    key={foodMaterial.foodMaterialId}
                    className={getRowClassName(foodMaterial)}
                  >
                    {foodMaterialColumnList.map((column) => (
                      <td
                        key={column.key}
                        className={getCellClassName(foodMaterial, column.key)}
                      >
                        {column.getValue(foodMaterial)}
                      </td>
                    ))}
                    <td
                      className={`food-materials-table__cell ${getColumnClassName("delete")}`}
                    >
                      <Button
                        type="button"
                        className="remove_btn"
                        onClick={() => {
                          onDelete(foodMaterial.foodMaterialId);
                        }}
                      >
                        X
                      </Button>
                    </td>
                  </tr>
                ))
              )}
              {isLoadingMore && (
                <tr>
                  <td
                    className="food-materials-table__message-cell"
                    colSpan={foodMaterialColumnList.length + 1}
                  >
                    다음 식자재 목록을 불러오는 중입니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default FoodMaterialsPage;
