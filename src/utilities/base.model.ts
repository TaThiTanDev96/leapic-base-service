export interface IBaseModel {
  created_at?: Date;
  updated_at?: Date;
  is_deleted?: boolean;
  id?: string;
}
export interface IBaseModelWithUser extends IBaseModel {
  user_id?: string;
}
