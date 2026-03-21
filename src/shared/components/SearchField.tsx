"use client";

import styles from "./search-field.module.css";
import { SearchIcon } from "@/shared/icons";

interface Props {
  placeholder?: string;
}

export function SearchField({ placeholder = "検索" }: Props) {
  return (
    <label className={styles.wrapper} aria-label="検索">
      <SearchIcon className={styles.icon} aria-hidden />
      <input className={styles.input} placeholder={placeholder} />
    </label>
  );
}

