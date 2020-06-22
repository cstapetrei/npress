import { Entity, Column, BeforeInsert, AfterLoad } from "typeorm";
import { Base } from "./Base";
import { IsUnique } from "../library/decorators/validation/IsUnique";

@Entity()
export class File extends Base{

    static readonly IMAGE_MIME_TYPES_ARRAY:Array<string> = [ "image/png", "image/tiff", "image/jpx", "image/jpeg", "image/svg+xml", "image/gif" ];
    static readonly VIDEO_MIME_TYPES_ARRAY:Array<string> = [ "video/mp4", "video/H264", "video/H265", "video/jpeg2000", "video/mpeg" ];
    static readonly AUDIO_MIME_TYPES_ARRAY:Array<string> = [ "audio/mpeg", "audio/vorbis", "audio/mp4", "audio/ogg" ];

    @Column('varchar', { length: 255 })
    name: string;

    @Column('varchar', { length: 128 })
    type: string;

    @Column('varchar', { length: 255, unique: true })
    @IsUnique()
    uri: string;

    @Column('text')
    html_title: string;

    @Column('text')
    html_alt: string;

    isImage: boolean|number = false;
    isVideo: boolean|number = false;
    isAudio: boolean|number = false;

    assign(requestBody: any): File {
        super.assign(requestBody);

        this.name = requestBody.name || this.name;
        this.type = requestBody.type || this.type || "application/octet-stream";
        this.html_title = requestBody.html_title || this.html_title || "";
        this.html_alt = requestBody.html_alt || this.html_alt || "";
        return this;
    }

    @BeforeInsert()
    setData(){
        this.status = Base.STATUS_ACTIVE;
        this.uri = '/uploads/' + this.name;
        this.uri = this.uri[0] !== '/' ? '/'+this.uri : this.uri;
    }

    @AfterLoad()
    setFlags(){
        this.isImage = this.type.match(/image\//) ? 1 : 0;//File.IMAGE_MIME_TYPES_ARRAY.indexOf(this.type) !== -1;
        this.isVideo = this.type.match(/video\//) ? 1 : 0;//File.VIDEO_MIME_TYPES_ARRAY.indexOf(this.type) !== -1;
        this.isAudio = this.type.match(/audio\//) ? 1 : 0;//File.AUDIO_MIME_TYPES_ARRAY.indexOf(this.type) !== -1;
    }
}