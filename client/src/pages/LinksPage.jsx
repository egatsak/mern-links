import React, { useContext, useState, useCallback } from "react";
import { useEffect } from "react";
import Loader from "../components/Loader";
import LinksList from "../components/LinksList";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";

const LinksPage = () => {
  const { token } = useContext(AuthContext);
  const { loading, request } = useHttp();
  const [links, setLinks] = useState([]);

  const fetchLinks = useCallback(async () => {
    try {
      const fetched = await request("/api/link", "GET", null, {
        Authorization: `Bearer ${token}`,
      });
      setLinks(fetched);
    } catch (e) {}
  }, [token, request]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);
  if (loading) return <Loader />;

  return <>{!loading && <LinksList links={links} />}</>;
};

export default LinksPage;
