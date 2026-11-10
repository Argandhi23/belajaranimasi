-- Maintain the document once per metadata change; reads can use the GIN index.
ALTER TABLE "Animation" ADD COLUMN "searchVector" tsvector;

CREATE FUNCTION animation_search_vector_update() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  NEW."searchVector" := to_tsvector('simple',
    NEW."technicalName" || ' ' || NEW."indonesianName" || ' ' ||
    NEW."shortDescription" || ' ' || array_to_string(NEW.keywords, ' ') || ' ' ||
    array_to_string(NEW.libraries, ' '));
  RETURN NEW;
END;
$$;

CREATE TRIGGER animation_search_vector_before_write
BEFORE INSERT OR UPDATE OF "technicalName", "indonesianName", "shortDescription", keywords, libraries
ON "Animation" FOR EACH ROW EXECUTE FUNCTION animation_search_vector_update();

-- Backfill existing rows through the same trigger used for future writes.
UPDATE "Animation" SET "technicalName" = "technicalName";
CREATE INDEX "Animation_searchVector_idx" ON "Animation" USING GIN ("searchVector");
