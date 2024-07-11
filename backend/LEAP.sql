PGDMP  4                    |           LEAP    16.3    16.3                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            	           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            
           1262    16406    LEAP    DATABASE     �   CREATE DATABASE "LEAP" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE "LEAP";
                postgres    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
                pg_database_owner    false                       0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                   pg_database_owner    false    4            �            1259    16429    engagements    TABLE     �  CREATE TABLE public.engagements (
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
       public         heap    postgres    false    4            �            1259    16471    engagements_engagementid_seq    SEQUENCE     �   ALTER TABLE public.engagements ALTER COLUMN engagementid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.engagements_engagementid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    4    218            �            1259    16407    sections    TABLE     n   CREATE TABLE public.sections (
    sectionid character varying(10) NOT NULL,
    isonline boolean NOT NULL
);
    DROP TABLE public.sections;
       public         heap    postgres    false    4            �            1259    16434    tactics    TABLE     �  CREATE TABLE public.tactics (
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
       public         heap    postgres    false    4            �            1259    16504    tactics_engagementid_seq    SEQUENCE     �   ALTER TABLE public.tactics ALTER COLUMN engagementid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tactics_engagementid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    4    219            �            1259    16512    unit_tactics    TABLE     �   CREATE TABLE public.unit_tactics (
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
       public         heap    postgres    false    4            �            1259    16412    units    TABLE     :  CREATE TABLE public.units (
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
       public         heap    postgres    false    4            �            1259    16419    units_id_seq    SEQUENCE     �   CREATE SEQUENCE public.units_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.units_id_seq;
       public          postgres    false    216    4                       0    0    units_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.units_id_seq OWNED BY public.units.id;
          public          postgres    false    217            b           2604    16420    units id    DEFAULT     d   ALTER TABLE ONLY public.units ALTER COLUMN id SET DEFAULT nextval('public.units_id_seq'::regclass);
 7   ALTER TABLE public.units ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    217    216                       0    16429    engagements 
   TABLE DATA           �   COPY public.engagements (sectionid, friendlyid, enemyid, friendlybasescore, enemybasescore, friendlytacticsscore, enemytacticsscore, iswin, enemytotalscore, friendlytotalscore, engagementid, timestamp_column) FROM stdin;
    public          postgres    false    218   9%       �          0    16407    sections 
   TABLE DATA           7   COPY public.sections (sectionid, isonline) FROM stdin;
    public          postgres    false    215   ?&                 0    16434    tactics 
   TABLE DATA              COPY public.tactics (friendlyawareness, enemyawareness, friendlylogistics, enemylogistics, friendlycoverage, enemycoverage, friendlygps, enemygps, friendlycomms, enemycomms, friendlyfire, enemyfire, friendlypattern, enemypattern, engagementid) FROM stdin;
    public          postgres    false    219   h&                 0    16512    unit_tactics 
   TABLE DATA           g   COPY public.unit_tactics ("ID", awareness, logistics, coverage, gps, comms, fire, pattern) FROM stdin;
    public          postgres    false    222   �,       �          0    16412    units 
   TABLE DATA           �   COPY public.units (unit_id, unit_type, unit_health, role_type, unit_size, force_posture, force_mobility, force_readiness, force_skill, children, section, id, root, "isFriendly", xcord, ycord, zcord) FROM stdin;
    public          postgres    false    216   :-                  0    0    engagements_engagementid_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public.engagements_engagementid_seq', 649, true);
          public          postgres    false    220                       0    0    tactics_engagementid_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.tactics_engagementid_seq', 649, true);
          public          postgres    false    221                       0    0    units_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.units_id_seq', 25, true);
          public          postgres    false    217            l           2606    16516    unit_tactics enemy_tactics_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.unit_tactics
    ADD CONSTRAINT enemy_tactics_pkey PRIMARY KEY ("ID");
 I   ALTER TABLE ONLY public.unit_tactics DROP CONSTRAINT enemy_tactics_pkey;
       public            postgres    false    222            h           2606    16473    engagements engagements_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.engagements
    ADD CONSTRAINT engagements_pkey PRIMARY KEY (engagementid);
 F   ALTER TABLE ONLY public.engagements DROP CONSTRAINT engagements_pkey;
       public            postgres    false    218            d           2606    16411    sections sections_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_pkey PRIMARY KEY (sectionid);
 @   ALTER TABLE ONLY public.sections DROP CONSTRAINT sections_pkey;
       public            postgres    false    215            j           2606    16506    tactics tactics_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.tactics
    ADD CONSTRAINT tactics_pkey PRIMARY KEY (engagementid);
 >   ALTER TABLE ONLY public.tactics DROP CONSTRAINT tactics_pkey;
       public            postgres    false    219            f           2606    16422    units units_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.units
    ADD CONSTRAINT units_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.units DROP CONSTRAINT units_pkey;
       public            postgres    false    216            m           2606    16517    unit_tactics id    FK CONSTRAINT     k   ALTER TABLE ONLY public.unit_tactics
    ADD CONSTRAINT id FOREIGN KEY ("ID") REFERENCES public.units(id);
 9   ALTER TABLE ONLY public.unit_tactics DROP CONSTRAINT id;
       public          postgres    false    222    4710    216                �   x���݊�0�����4���"�K��Ǵ�jZ�v�!�r�3'?��p9u�߹|Ɔ�0(\�C�F��lH�"s�Q�/P����@�$)#���4�<�\�'�Q.-쏝ۜ�;�ɧP��#�O+4Kb��t�8�����:''p�8��'��a}}0R��f�&]�B�I@�ٴo����H���?�A��,�a����w��Q4T���}ҚX�>{�0y�
2�dVZXݬ�������/=      �      x��5u�L�
1s�,����� !:         m  x���knZ[����`Z�k�K����m;1��"UpЗ�H�:;~��G��ۯ����_���s<����k���������m}u�>�}\�x��{�ޫ�^��j����c�j�W�����f�6{�٫�^m�j�W;{��W;{��W;{��W;{��W;{��W��j�^�ګ]{�k�v�ծ�ڵW��j�^��W����{��^��W����{��^��W���{��^��W{��{��^��W{��{��^-n{����ⶇ��^.n{�����ǋ�^/n{���_�_�_�_�_�_�_�_�_�_�_�_�_�_�_�_�_�_�_�_�_�_�_�_���C A�!>@D@F�D@J,�D@N< E@RL@E@V\�E@Z�y������ /� # � 1� #�� 3�@# � 5�`#�� 7��# � 9��#�� ;��# � =��#�� ?�H�#Ꮔ?�H�#Ꮔ?�H�#Ꮔ?�H�#Ꮔ?�H�#Ꮔ?�H�#Ꮔ?�H�#Ꮔ?�H�#Ꮔ?�H�#Ꮔ?�H�#Ꮔ?�H�#Ꮔ?�H�#Ꮔ?�H�#Ꮔ?�H�#Ꮔ?�H�#Ꮔ?�H�#Ꮔ?���?�H�#Ꮔ?�H�#Ꮔ?�H�#Ꮔ?�H�#Ꮔ?�H�#Ꮔ?�H�#Ꮔ?�H�#Ꮔ?�H�#Ꮔ?�鏯w/|<�>ϧ?n��?��m^O��_=����0o�q���_�����;�����?
�(�����?
�(�����?
�(�����?
�(�����?
�(�����?
�(������S�J7P�*�B�Q�G��Q�G��Q�G��Q�G��Q�G��Q�G��Q�G��Q�G��Q�G��Q�G��Q�G��Q�G��Q�G��Q�G��Q����Gc���Gc���4�4���Gc���G�4���G�4���G�4���G�4���G�4���G�4���G�4���G��q���q���$��r�,�s�4���G�4���Gϵ޿�s����~���gs�y������5G?��Ꮖ?�h��Ꮖ?�h��᏾z�|������k�����������s4���G�4���G�4�ы?>����}������?�h��Ꮖ?��c���a���������5�����������G��8x{|�����&n������5b���⏟:O�����׿�?�|���߿����^�1����1����1����1����1����1����1������:N��^c^s�Ӊ�������?�������,������d�~��,�x�����c���?��c�����B������c���?����c���c���?��c���?��c����c���?江��c���?��c�������������`�q��8�����`�q��8���`�q��8���`�q��8�����8�ǁ?�q������8�ǁ?�q������8���������_������m^���q����<��������t�'�         E   x�e͹�0C�:&�;�.����3T�"Ǒ�EA��� �~}p��_N���	+ӊyF�PD%T      �   ?  x���ˎ�0���)��,2ܙv�k��	�J���'�jb���U߽d ����!�������3W7�W�BSa&���z����)��s��Q,3�ٰG�	h�"���Ʒ��9џ��y�(B�xٯ�±�3=pO7T�#`�s�3Y~���9KvG�v� �C�I�A^1���~OB��rH�Г��K8O�u�2� �����r)wc�NԑJ5�w�5�:K�|�1�uM,��]N"��`b����d�<����������������4���&4^	�#�D�R7���%���Us!u�*��uí^^@=ԅ�ӂ�Ni�-xE�$g��;��|�ٯ�6V�	���B��|��L��J���GW��<��`���H������*7���&g�������38l)�k)N��2,(g���,����(Ƕ�Po
��}4��êP�Q����. �)0q��{^U����sl�\���ϡd�Eq���ʈ
��8�u�}��
˨��U���tϱ���o�k�կ����|5N�=tF��L�d�f���R�����V����N�g��P     