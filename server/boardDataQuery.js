const sql = `with "cardTags" as (
  select t."cardId", array_to_json(array_agg(json_build_object(
    'tagId', "tagId",
    'color', "color",
    'text', "text"
  ))) as matching
  from (
    select
      tc."cardId",
      t."tagId",
      "color",
      "text"
    from "tagsCards" tc
    join tags t using ("tagId")
  ) as t
  group by t."cardId"
), "colCards" as (
  select c."columnId", array_to_json(array_agg(json_build_object(
    'cardId', "cardId",
    'name', "name",
    'description', "description",
    'tags', "tags",
    'columnId', c."columnId"
  ))) as matching
  from (
    select
      "boardId",
      "sequenceNum",
      "cardId",
      "columnId",
      "name",
      "description",
      coalesce((select matching from "cardTags" where "cardTags"."cardId" = c."cardId"), '[]'::json) as tags
    from cards c
    order by "sequenceNum"
  ) as c
  group by c."columnId"
), "cols" as (
  select cols."boardId", array_to_json(array_agg(json_build_object(
    'boardId', cols."boardId",
    'columnId', "columnId",
    'name', "name",
    'cards', "cards"
  ))) as matching
  from (
    select
      "boardId",
      "columnId",
      "name",
      coalesce((select matching from "colCards" where "colCards"."columnId" = c."columnId"), '[]'::json) as cards
    from columns c
    order by "sequenceNum"
  ) as cols
  group by cols."boardId"
)
select
  "boardId",
  "name",
  coalesce((select matching from "cols" where "cols"."boardId" = b."boardId"), '[]'::json) as columns
from boards b
where b."boardId" = $1`;

module.exports = { sql };
