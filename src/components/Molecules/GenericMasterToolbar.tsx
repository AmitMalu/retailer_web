import { GenericTableHeader } from "@/Common/interface";
import { useEffect, useRef } from "react";
import ButtonComponent from "../Atoms/NewComponents/ButtonComponent";
import { AddIconSvg, DownloadIcon, FilterSvgIcon, RefreshIcon } from "@/assets/svg";
import TextInputComponent from "../Atoms/NewComponents/TextInputComponent";
import { useTheme } from "@mui/material";
import ColumnVisibilityMenu from "./ColumnVisibilityMenu";

type GenericMasterToolbarProps = {
  addButtonText?: string;
  onAdd?: () => void;
  onExport?: () => void;
  onFilter?: () => void;
  onRefresh?: () => void;
  onColumnChange?: (key: string) => void;
  headers?: GenericTableHeader<any>[];
  visibleColumns?: string[];
  onToggleAll?: (selectAll: boolean) => void;
  loading?: boolean;
  error?: null | string;
  onSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchValue?: string;
  searchPlaceholder?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

const GenericMasterToolbar = ({
  addButtonText,
  onAdd,
  onExport,
  onFilter,
  onSearch,
  searchValue,
  onKeyDown,
  searchPlaceholder = "Search...",
  onRefresh,
  onColumnChange,
  onToggleAll,
  headers,
  visibleColumns,
  loading = false,
  error = null,
}: GenericMasterToolbarProps) => {

  const inputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme()

  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  return (
    <>
      <div className="flex justify-between mt-2">
        {/* Add Button */}
        <div className="flex items-end">
          {addButtonText && (
            <ButtonComponent
              style={{ padding: "4px 8px", height: 32, margin: 0 }}
              radius={1}
              onClick={onAdd}
              textColor={theme.palette.primary.contrastText}
              fontSize="14"
              bgColor={theme.palette.primary.main}
              borderColor={theme.palette.background.paper}
              leftIcon={<AddIconSvg />}
              disabled={!!loading}

            >
              {addButtonText}
            </ButtonComponent>
          )}
        </div>

        {/*Table Controls */}
        <div>
          {/* Search Bar */}
          {onSearch && (
            <TextInputComponent
              ref={inputRef}
              className="inline-block h-[40px] w-[250px] "
              name="search"
              size="sm"
              value={searchValue || ""}
              placeholder={searchPlaceholder}
              onKeyDown={onKeyDown}
              onChange={onSearch}
              disabled={loading}
            />
          )}

          {/* Filter Icon */}
          {onFilter && <ButtonComponent
            style={{ padding: "4px 8px", height: 32 }}
            radius={1}
            textColor={theme.palette.text.primary}
            borderColor={theme.palette.gray.DEFAULT}
            fontSize="16"
            throttleMs={0}
            bgColor={theme.palette.background.paper}
            onClick={onFilter}
            leftIcon={<FilterSvgIcon color={theme.palette.primary.main} />}
            disabled={!!loading || !!error}
          >
            Filter
          </ButtonComponent>}

          {/* Download Icon */}
          {onExport && <ButtonComponent
            style={{ padding: "4px 8px", height: 32 }}
            radius={1}
            textColor={theme.palette.text.primary}
            borderColor={theme.palette.gray.DEFAULT}
            fontSize="16"
            throttleMs={5000}
            bgColor={theme.palette.background.paper}
            onClick={onExport}
            leftIcon={<DownloadIcon />}
            disabled={!!loading || !!error}
          >
            Export
          </ButtonComponent>}

          {/* Col Icon */}
          {onColumnChange && <ColumnVisibilityMenu
            headers={headers || []}
            visibleColumns={visibleColumns || []}
            onToggleColumn={onColumnChange ?? (() => { })}
            onToggleAll={onToggleAll}
          />}

          {/* Refresh Icon */}
          {onRefresh && <ButtonComponent
            style={{ height: 32, width: 6, paddingLeft: "28px" }}
            radius={1}
            textColor={theme.palette.text.primary}
            bgColor={theme.palette.background.paper}
            fontSize="16"
            throttleMs={5000}
            borderColor={theme.palette.gray.DEFAULT}
            leftIcon={<RefreshIcon />}
            onClick={onRefresh}
            disabled={!!loading}
          >
            <></>
          </ButtonComponent>}
        </div>
      </div>
    </>
  );
};

export default GenericMasterToolbar;
