PGDMP  )    9                |            LEAP    16.3    16.4 (Debian 16.4-1.pgdg120+1) $               0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            	           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            
           1262    16469    LEAP    DATABASE     �   CREATE DATABASE "LEAP" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE "LEAP";
                postgres    false            �            1259    16470    engagements    TABLE     �  CREATE TABLE public.engagements (
    sectionid character(3) NOT NULL,
    friendlyid character varying(20),
    enemyid character varying(20),
    friendlybasescore numeric,
    enemybasescore numeric,
    friendlytacticsscore numeric,
    enemytacticsscore numeric,
    iswin boolean,
    enemytotalscore numeric,
    friendlytotalscore numeric,
    engagementid integer NOT NULL,
    timestamp_column timestamp without time zone
);
    DROP TABLE public.engagements;
       public         heap    postgres    false                       0    0    TABLE engagements    ACL     1   GRANT ALL ON TABLE public.engagements TO PUBLIC;
          public          postgres    false    215            �            1259    16475    engagements_engagementid_seq    SEQUENCE     �   ALTER TABLE public.engagements ALTER COLUMN engagementid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.engagements_engagementid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    215                       0    0 %   SEQUENCE engagements_engagementid_seq    ACL     E   GRANT ALL ON SEQUENCE public.engagements_engagementid_seq TO PUBLIC;
          public          postgres    false    216            �            1259    16476    sections    TABLE     n   CREATE TABLE public.sections (
    sectionid character varying(10) NOT NULL,
    isonline boolean NOT NULL
);
    DROP TABLE public.sections;
       public         heap    postgres    false                       0    0    TABLE sections    ACL     .   GRANT ALL ON TABLE public.sections TO PUBLIC;
          public          postgres    false    217            �            1259    16479    tactics    TABLE     �  CREATE TABLE public.tactics (
    friendlyawareness integer,
    enemyawareness integer,
    friendlylogistics integer,
    enemylogistics integer,
    friendlycoverage integer,
    enemycoverage integer,
    friendlygps integer,
    enemygps integer,
    friendlycomms integer,
    enemycomms integer,
    friendlyfire integer,
    enemyfire integer,
    friendlypattern integer,
    enemypattern integer,
    engagementid integer NOT NULL
);
    DROP TABLE public.tactics;
       public         heap    postgres    false                       0    0    TABLE tactics    ACL     -   GRANT ALL ON TABLE public.tactics TO PUBLIC;
          public          postgres    false    218            �            1259    16482    tactics_engagementid_seq    SEQUENCE     �   ALTER TABLE public.tactics ALTER COLUMN engagementid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tactics_engagementid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    218                       0    0 !   SEQUENCE tactics_engagementid_seq    ACL     A   GRANT ALL ON SEQUENCE public.tactics_engagementid_seq TO PUBLIC;
          public          postgres    false    219            �            1259    16483    unit_tactics    TABLE     �   CREATE TABLE public.unit_tactics (
    "ID" integer NOT NULL,
    awareness integer,
    logistics integer,
    coverage integer,
    gps integer,
    comms integer,
    fire integer,
    pattern integer
);
     DROP TABLE public.unit_tactics;
       public         heap    postgres    false                       0    0    TABLE unit_tactics    ACL     2   GRANT ALL ON TABLE public.unit_tactics TO PUBLIC;
          public          postgres    false    220            �            1259    16486    units    TABLE     :  CREATE TABLE public.units (
    unit_id character varying(50) NOT NULL,
    unit_type character varying(50),
    unit_health integer,
    role_type character varying(50),
    unit_size character varying(50),
    force_posture character varying(50),
    force_mobility character varying(50),
    force_readiness character varying(50),
    force_skill character varying(50),
    children character varying[],
    section character varying(50),
    id integer NOT NULL,
    root boolean,
    "isFriendly" boolean,
    xcord numeric,
    ycord numeric,
    zcord numeric
);
    DROP TABLE public.units;
       public         heap    postgres    false                       0    0    TABLE units    ACL     +   GRANT ALL ON TABLE public.units TO PUBLIC;
          public          postgres    false    221            �            1259    16491    units_id_seq    SEQUENCE     �   CREATE SEQUENCE public.units_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.units_id_seq;
       public          postgres    false    221                       0    0    units_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.units_id_seq OWNED BY public.units.id;
          public          postgres    false    222                       0    0    SEQUENCE units_id_seq    ACL     5   GRANT ALL ON SEQUENCE public.units_id_seq TO PUBLIC;
          public          postgres    false    222            b           2604    16492    units id    DEFAULT     d   ALTER TABLE ONLY public.units ALTER COLUMN id SET DEFAULT nextval('public.units_id_seq'::regclass);
 7   ALTER TABLE public.units ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    222    221            �          0    16470    engagements 
   TABLE DATA           �   COPY public.engagements (sectionid, friendlyid, enemyid, friendlybasescore, enemybasescore, friendlytacticsscore, enemytacticsscore, iswin, enemytotalscore, friendlytotalscore, engagementid, timestamp_column) FROM stdin;
    public          postgres    false    215   �)       �          0    16476    sections 
   TABLE DATA           7   COPY public.sections (sectionid, isonline) FROM stdin;
    public          postgres    false    217   ?*                  0    16479    tactics 
   TABLE DATA              COPY public.tactics (friendlyawareness, enemyawareness, friendlylogistics, enemylogistics, friendlycoverage, enemycoverage, friendlygps, enemygps, friendlycomms, enemycomms, friendlyfire, enemyfire, friendlypattern, enemypattern, engagementid) FROM stdin;
    public          postgres    false    218   h*                 0    16483    unit_tactics 
   TABLE DATA           g   COPY public.unit_tactics ("ID", awareness, logistics, coverage, gps, comms, fire, pattern) FROM stdin;
    public          postgres    false    220   �*                 0    16486    units 
   TABLE DATA           �   COPY public.units (unit_id, unit_type, unit_health, role_type, unit_size, force_posture, force_mobility, force_readiness, force_skill, children, section, id, root, "isFriendly", xcord, ycord, zcord) FROM stdin;
    public          postgres    false    221   �*                  0    0    engagements_engagementid_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public.engagements_engagementid_seq', 656, true);
          public          postgres    false    216                       0    0    tactics_engagementid_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.tactics_engagementid_seq', 656, true);
          public          postgres    false    219                       0    0    units_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.units_id_seq', 39, true);
          public          postgres    false    222            j           2606    16494    unit_tactics enemy_tactics_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.unit_tactics
    ADD CONSTRAINT enemy_tactics_pkey PRIMARY KEY ("ID");
 I   ALTER TABLE ONLY public.unit_tactics DROP CONSTRAINT enemy_tactics_pkey;
       public            postgres    false    220            d           2606    16496    engagements engagements_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.engagements
    ADD CONSTRAINT engagements_pkey PRIMARY KEY (engagementid);
 F   ALTER TABLE ONLY public.engagements DROP CONSTRAINT engagements_pkey;
       public            postgres    false    215            f           2606    16498    sections sections_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_pkey PRIMARY KEY (sectionid);
 @   ALTER TABLE ONLY public.sections DROP CONSTRAINT sections_pkey;
       public            postgres    false    217            h           2606    16500    tactics tactics_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.tactics
    ADD CONSTRAINT tactics_pkey PRIMARY KEY (engagementid);
 >   ALTER TABLE ONLY public.tactics DROP CONSTRAINT tactics_pkey;
       public            postgres    false    218            l           2606    16502    units units_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.units
    ADD CONSTRAINT units_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.units DROP CONSTRAINT units_pkey;
       public            postgres    false    221            m           2606    16503    unit_tactics id    FK CONSTRAINT     k   ALTER TABLE ONLY public.unit_tactics
    ADD CONSTRAINT id FOREIGN KEY ("ID") REFERENCES public.units(id);
 9   ALTER TABLE ONLY public.unit_tactics DROP CONSTRAINT id;
       public          postgres    false    220    221    4716            �   j   x�1v���s�u
rw�u��q���2���,�������)g��p��X"������1�3S�r���cH'{��d�1��1��=�t��dO� X�      �      x�1v�,��5u�L����� !?5          7   x�3�4�	�L����\�b��F䍱���Mțb��ofj����� >i             x�36�4D�\�&�����h1z\\\ ��
�         7  x����n�0�y
�n��z4� )qo�L�HH`SpR���^;�t��`H�7���s�/�h}�>t�t���FH}���H�4i�@V�KӇ�(١�e��eY���8�o�-3c^vz��xG$�OY�Ajdۊ����"WT��Է+�lD�����4�5�/�nwS��a��|��X^�>�	�3��,�~%A����
)�Y��5}Ѥ�ݷ�Fz�����^+N`�؍�T2�xw���wWHQ���p�p�����<u��\��>z��FI���L��,�Ӊ!S�t��K�0>l��"     